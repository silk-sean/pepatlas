/**
 * Ghost engagement orchestrator.
 *
 *  - queueGhostReplies(target): inserts 2-4 GhostReplyJob rows with
 *    staggered scheduledFor times. Called when a REAL user posts.
 *  - processGhostJobs({ dueOnly }): finds jobs whose scheduledFor <= now,
 *    generates AI replies from random ghost users, inserts into Reply
 *    table. Run by cron every 5 min.
 *  - freshenForum({ threadCount }): one-shot bulk pass to backdate-seed
 *    recent activity across stale categories. Run on demand from admin
 *    panel.
 */
import { db } from "@/lib/db";
import { draftGhostReply, draftGhostThread } from "@/lib/ghost-writer";

const SEED_EMAIL_SUFFIX = "@seed.pepatlas.local";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function pickRandomGhostUsers(count: number, exclude: string[] = []) {
  // Prisma has no RANDOM() ordering portably, so we fetch a window + shuffle.
  // We have ~100 ghosts, so this is fine.
  const ghosts = await db.user.findMany({
    where: {
      email: { endsWith: SEED_EMAIL_SUFFIX },
      id: exclude.length ? { notIn: exclude } : undefined,
    },
    select: { id: true, username: true },
    take: 200,
  });
  const shuffled = ghosts.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function isSeedEmail(email: string | null | undefined): boolean {
  return !!email && email.endsWith(SEED_EMAIL_SUFFIX);
}

export async function userIsGhost(userId: string): Promise<boolean> {
  const u = await db.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  return isSeedEmail(u?.email);
}

// ─── Queue: triggered by real-user activity ────────────────────────────────

interface QueueOpts {
  kind: "REPLY_TO_THREAD" | "REPLY_TO_REPLY";
  threadId: string;
  parentReplyId?: string;
  // Real-user trigger: skew delays toward natural social response times.
  // minDelayMin..maxDelayMin over the N jobs.
  minDelayMin?: number;
  maxDelayMin?: number;
  countMin?: number;
  countMax?: number;
}

export async function queueGhostReplies(opts: QueueOpts) {
  const countMin = opts.countMin ?? 2;
  const countMax = opts.countMax ?? 4;
  const count = countMin + Math.floor(Math.random() * (countMax - countMin + 1));

  const minDelayMs = (opts.minDelayMin ?? 15) * 60 * 1000;
  const maxDelayMs = (opts.maxDelayMin ?? 8 * 60) * 60 * 1000;

  const now = Date.now();
  const delays: number[] = [];
  for (let i = 0; i < count; i++) {
    // Jittered random delay per job, not evenly spread — real engagement is bursty.
    const d = minDelayMs + Math.random() * (maxDelayMs - minDelayMs);
    delays.push(d);
  }
  delays.sort((a, b) => a - b);

  const created = await Promise.all(
    delays.map((d) =>
      db.ghostReplyJob.create({
        data: {
          kind: opts.kind,
          threadId: opts.threadId,
          parentReplyId: opts.parentReplyId ?? null,
          scheduledFor: new Date(now + d),
        },
        select: { id: true, scheduledFor: true },
      })
    )
  );

  return { queued: created.length, jobs: created };
}

// ─── Process: called by cron or admin "run now" ────────────────────────────

export async function processGhostJobs(opts?: { limit?: number; all?: boolean }) {
  const limit = opts?.limit ?? 15;
  const now = new Date();

  const due = await db.ghostReplyJob.findMany({
    where: {
      status: "PENDING",
      ...(opts?.all ? {} : { scheduledFor: { lte: now } }),
    },
    orderBy: { scheduledFor: "asc" },
    take: limit,
  });

  const results: Array<{ id: string; ok: boolean; error?: string; replyId?: string }> = [];

  for (const job of due) {
    try {
      const thread = await db.thread.findUnique({
        where: { id: job.threadId },
        select: {
          id: true,
          title: true,
          body: true,
          authorId: true,
          replies: {
            orderBy: { createdAt: "desc" },
            take: 10,
            select: {
              id: true,
              body: true,
              authorId: true,
              author: { select: { username: true } },
            },
          },
        },
      });

      if (!thread) {
        await db.ghostReplyJob.update({
          where: { id: job.id },
          data: {
            status: "FAILED",
            errorMessage: "thread not found",
            completedAt: new Date(),
          },
        });
        results.push({ id: job.id, ok: false, error: "thread not found" });
        continue;
      }

      // Exclude ghosts who already replied recently to this thread to
      // avoid the same ghost replying 3x.
      const recentGhostAuthorIds = thread.replies
        .map((r) => r.authorId)
        .filter(Boolean);

      const [ghost] = await pickRandomGhostUsers(1, recentGhostAuthorIds);
      if (!ghost) {
        await db.ghostReplyJob.update({
          where: { id: job.id },
          data: {
            status: "FAILED",
            errorMessage: "no eligible ghost user",
            completedAt: new Date(),
          },
        });
        results.push({ id: job.id, ok: false, error: "no eligible ghost user" });
        continue;
      }

      // If job is REPLY_TO_REPLY, fetch parent specifically.
      let isReplyingTo: { author: string; body: string } | undefined;
      if (job.kind === "REPLY_TO_REPLY" && job.parentReplyId) {
        const parent = await db.reply.findUnique({
          where: { id: job.parentReplyId },
          select: {
            body: true,
            author: { select: { username: true } },
          },
        });
        if (parent) {
          isReplyingTo = {
            author: parent.author?.username ?? "user",
            body: parent.body,
          };
        }
      }

      const draft = await draftGhostReply({
        threadTitle: thread.title,
        threadBody: thread.body,
        existingReplies: thread.replies.map((r) => ({
          author: r.author?.username ?? "user",
          body: r.body,
        })),
        isReplyingTo,
      });

      if (!draft || !draft.body) {
        await db.ghostReplyJob.update({
          where: { id: job.id },
          data: {
            status: "FAILED",
            errorMessage: "AI draft empty",
            completedAt: new Date(),
          },
        });
        results.push({ id: job.id, ok: false, error: "AI draft empty" });
        continue;
      }

      const reply = await db.$transaction([
        db.reply.create({
          data: {
            body: draft.body,
            authorId: ghost.id,
            threadId: thread.id,
            parentId: job.kind === "REPLY_TO_REPLY" ? job.parentReplyId : null,
          },
          select: { id: true },
        }),
        db.thread.update({
          where: { id: thread.id },
          data: {
            lastReplyAt: new Date(),
            lastReplyAuthorId: ghost.id,
            replyCount: { increment: 1 },
            updatedAt: new Date(),
          },
        }),
        db.user.update({
          where: { id: ghost.id },
          data: { postCount: { increment: 1 } },
        }),
        db.ghostReplyJob.update({
          where: { id: job.id },
          data: {
            status: "DONE",
            resultReplyId: "pending",
            completedAt: new Date(),
          },
        }),
      ]);

      // Set the real resultReplyId now that we know it.
      await db.ghostReplyJob.update({
        where: { id: job.id },
        data: { resultReplyId: reply[0].id },
      });

      results.push({ id: job.id, ok: true, replyId: reply[0].id });
    } catch (e) {
      const msg = (e as Error).message || String(e);
      await db.ghostReplyJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          errorMessage: msg.slice(0, 500),
          completedAt: new Date(),
        },
      });
      results.push({ id: job.id, ok: false, error: msg });
    }
  }

  return { processed: results.length, results };
}

// ─── Freshen: backdate-seed activity across stale categories ───────────────

export interface FreshenResult {
  threadsTouched: number;
  repliesCreated: number;
  newThreadsCreated: number;
  errors: number;
}

export async function freshenForum(opts: {
  threadsToTouch?: number;
  windowHours?: number;
  seedEmptyCategories?: boolean;
}): Promise<FreshenResult> {
  const threadsToTouch = opts.threadsToTouch ?? 40;
  const windowMs = (opts.windowHours ?? 48) * 60 * 60 * 1000;
  const windowStart = Date.now() - windowMs;

  const result: FreshenResult = {
    threadsTouched: 0,
    repliesCreated: 0,
    newThreadsCreated: 0,
    errors: 0,
  };

  // 1. Seed empty categories with a starter thread + 1-2 replies.
  if (opts.seedEmptyCategories !== false) {
    const emptyCategories = await db.forumCategory.findMany({
      where: { threads: { none: {} } },
      select: { id: true, name: true, slug: true },
    });

    for (const cat of emptyCategories) {
      try {
        const draft = await draftGhostThread({
          categoryName: cat.name,
          categorySlug: cat.slug,
        });
        if (!draft) {
          result.errors += 1;
          continue;
        }
        const [author] = await pickRandomGhostUsers(1);
        if (!author) continue;

        const slugBase = draft.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 60);
        const createdAt = new Date(
          windowStart + Math.random() * windowMs
        );

        const thread = await db.thread.create({
          data: {
            title: draft.title,
            slug: slugBase || `starter-${Date.now()}`,
            body: draft.body,
            authorId: author.id,
            categoryId: cat.id,
            createdAt,
            updatedAt: createdAt,
            lastReplyAt: createdAt,
            lastReplyAuthorId: author.id,
          },
          select: { id: true },
        });

        await db.user.update({
          where: { id: author.id },
          data: { postCount: { increment: 1 } },
        });

        result.newThreadsCreated += 1;

        // Add 1-2 follow-up replies to new thread
        const followupCount = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < followupCount; i++) {
          const [ghost] = await pickRandomGhostUsers(1, [author.id]);
          if (!ghost) continue;
          const reply = await draftGhostReply({
            threadTitle: draft.title,
            threadBody: draft.body,
            existingReplies: [],
          });
          if (!reply) continue;
          const replyAt = new Date(
            createdAt.getTime() + (1 + Math.random() * 20) * 60 * 60 * 1000
          );
          // Clamp to within window
          const clamped = replyAt.getTime() > Date.now()
            ? new Date(Date.now() - Math.random() * 60 * 60 * 1000)
            : replyAt;
          await db.$transaction([
            db.reply.create({
              data: {
                body: reply.body,
                authorId: ghost.id,
                threadId: thread.id,
                createdAt: clamped,
                updatedAt: clamped,
              },
            }),
            db.thread.update({
              where: { id: thread.id },
              data: {
                lastReplyAt: clamped,
                lastReplyAuthorId: ghost.id,
                replyCount: { increment: 1 },
                updatedAt: clamped,
              },
            }),
            db.user.update({
              where: { id: ghost.id },
              data: { postCount: { increment: 1 } },
            }),
          ]);
          result.repliesCreated += 1;
        }
      } catch (e) {
        console.error("[freshen] empty cat seed failed:", e);
        result.errors += 1;
      }
    }
  }

  // 2. Category-balanced pick: guarantee at least one stale thread per
  //    category, then fill remaining quota by overall staleness.
  //    Global "oldest N" misses categories whose threads happen to be
  //    younger than the N-th oldest thread overall.
  const categories = await db.forumCategory.findMany({ select: { id: true } });

  const perCategoryPicks: Array<{
    id: string;
    title: string;
    body: string;
    authorId: string;
    categoryId: string;
    replies: {
      id: string;
      body: string;
      authorId: string;
      author: { username: string | null } | null;
    }[];
  }> = [];
  const pickedIds = new Set<string>();
  const perCategoryQuota = Math.max(
    1,
    Math.floor(threadsToTouch / categories.length)
  );

  for (const cat of categories) {
    const catThreads = await db.thread.findMany({
      where: { categoryId: cat.id },
      orderBy: { lastReplyAt: "asc" },
      take: perCategoryQuota,
      select: {
        id: true,
        title: true,
        body: true,
        authorId: true,
        categoryId: true,
        replies: {
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            body: true,
            authorId: true,
            author: { select: { username: true } },
          },
        },
      },
    });
    for (const t of catThreads) {
      if (!pickedIds.has(t.id)) {
        perCategoryPicks.push(t);
        pickedIds.add(t.id);
      }
    }
  }

  // Fill remaining quota from globally-stalest threads not already picked.
  const extraNeeded = Math.max(0, threadsToTouch - perCategoryPicks.length);
  const extras = extraNeeded
    ? await db.thread.findMany({
        where: { id: { notIn: Array.from(pickedIds) } },
        orderBy: { lastReplyAt: "asc" },
        take: extraNeeded,
        select: {
          id: true,
          title: true,
          body: true,
          authorId: true,
          categoryId: true,
          replies: {
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
              id: true,
              body: true,
              authorId: true,
              author: { select: { username: true } },
            },
          },
        },
      })
    : [];

  const shuffled = [...perCategoryPicks, ...extras]
    .sort(() => Math.random() - 0.5)
    .slice(0, threadsToTouch);

  for (const thread of shuffled) {
    try {
      const existingAuthors = [thread.authorId, ...thread.replies.map((r) => r.authorId)];
      const [ghost] = await pickRandomGhostUsers(1, existingAuthors);
      if (!ghost) continue;

      const draft = await draftGhostReply({
        threadTitle: thread.title,
        threadBody: thread.body,
        existingReplies: thread.replies.map((r) => ({
          author: r.author?.username ?? "user",
          body: r.body,
        })),
      });
      if (!draft) {
        result.errors += 1;
        continue;
      }

      // Timestamp within the window, weighted toward recent hours.
      const weight = Math.pow(Math.random(), 0.4); // bias toward 1
      const offset = windowMs * (1 - weight);
      const createdAt = new Date(Date.now() - offset);

      await db.$transaction([
        db.reply.create({
          data: {
            body: draft.body,
            authorId: ghost.id,
            threadId: thread.id,
            createdAt,
            updatedAt: createdAt,
          },
        }),
        db.thread.update({
          where: { id: thread.id },
          data: {
            lastReplyAt: createdAt,
            lastReplyAuthorId: ghost.id,
            replyCount: { increment: 1 },
            updatedAt: createdAt,
          },
        }),
        db.user.update({
          where: { id: ghost.id },
          data: { postCount: { increment: 1 } },
        }),
      ]);

      result.threadsTouched += 1;
      result.repliesCreated += 1;
    } catch (e) {
      console.error("[freshen] thread touch failed:", e);
      result.errors += 1;
    }
  }

  return result;
}
