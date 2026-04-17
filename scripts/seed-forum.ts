/**
 * Forum seeder: creates ~100 personas + ~200 threads + ~1500 replies
 * across all forum categories with realistic timestamps and reactions.
 *
 * Idempotent by email: re-running will skip users/threads that already exist.
 * All seeded users have email ending in @seed.pepatlas.local so they're filterable.
 *
 * Usage:
 *   # Local dev
 *   DATABASE_URL=... tsx scripts/seed-forum.ts
 *   # Production (from inside the app container):
 *   docker compose exec -T app sh -lc 'DATABASE_URL="$DATABASE_URL" npx tsx scripts/seed-forum.ts'
 */
import { PrismaClient, Prisma, Role, ReactionType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { USERS } from "./seed-data/users";
import { THREADS_BY_CATEGORY } from "./seed-data/threads";

const connectionString =
  process.env.DATABASE_URL || "postgresql://placeholder@localhost:5432/placeholder";
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
  log: ["error", "warn"],
});

const SEED_EMAIL_SUFFIX = "@seed.pepatlas.local";
// A dummy password hash that cannot match any plausible input
const SEED_PWHASH = bcrypt.hashSync(
  `seed-only-${Math.random().toString(36)}-${Date.now()}`,
  10
);

function daysAgo(d: number, jitterHours = 0): Date {
  const t = new Date();
  t.setDate(t.getDate() - d);
  if (jitterHours) {
    t.setHours(t.getHours() - Math.floor(Math.random() * jitterHours));
    t.setMinutes(Math.floor(Math.random() * 60));
  }
  return t;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

async function upsertUsers() {
  console.log(`[seed] upserting ${USERS.length} users…`);
  for (const u of USERS) {
    const email = `${u.username}${SEED_EMAIL_SUFFIX}`;
    // daysSinceJoin controls spread of created dates
    const joinedDate = daysAgo(u.daysSinceJoin, 24);
    const stackJson = u.stack
      ? ({
          title: u.stack.title,
          items: u.stack.items,
          updatedAt: joinedDate.toISOString(),
        } as object)
      : Prisma.JsonNull;

    await db.user.upsert({
      where: { email },
      update: {
        username: u.username,
        name: u.name ?? null,
        bio: u.bio ?? null,
        location: u.location ?? null,
        signature: u.signature ?? null,
        role: (u.role ?? "MEMBER") as Role,
        postCount: 0, // reset; will be recomputed after threads/replies inserted
        stackJson,
      },
      create: {
        email,
        username: u.username,
        name: u.name ?? null,
        bio: u.bio ?? null,
        location: u.location ?? null,
        signature: u.signature ?? null,
        role: (u.role ?? "MEMBER") as Role,
        passwordHash: SEED_PWHASH,
        postCount: 0,
        stackJson,
        createdAt: joinedDate,
        emailVerified: joinedDate,
      },
    });
  }
}

async function getCategoryMap() {
  const cats = await db.forumCategory.findMany({ select: { id: true, slug: true } });
  return new Map(cats.map((c) => [c.slug, c.id]));
}

async function getUserMap() {
  const users = await db.user.findMany({
    where: { email: { endsWith: SEED_EMAIL_SUFFIX } },
    select: { id: true, username: true },
  });
  return new Map(users.map((u) => [u.username!, u.id]));
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function seedThreads() {
  const catMap = await getCategoryMap();
  const userMap = await getUserMap();

  let threadCount = 0;
  let replyCount = 0;
  let reactionCount = 0;

  for (const [categorySlug, threads] of Object.entries(THREADS_BY_CATEGORY)) {
    const categoryId = catMap.get(categorySlug);
    if (!categoryId) {
      console.warn(`[seed] unknown category slug: ${categorySlug}`);
      continue;
    }
    for (const t of threads) {
      const authorId = userMap.get(t.author);
      if (!authorId) {
        console.warn(`[seed] unknown author: ${t.author}`);
        continue;
      }
      const threadCreatedAt = daysAgo(t.daysAgo, 24);
      const baseSlug = slugify(t.title);

      // Idempotent: if a thread with this (categoryId, slug) already exists, skip
      const existing = await db.thread.findFirst({
        where: { categoryId, slug: baseSlug },
        select: { id: true },
      });
      if (existing) continue;

      const replies = t.replies ?? [];
      const lastReply = replies[replies.length - 1];
      const lastReplyAt = lastReply
        ? daysAgo(lastReply.daysAgo, 12)
        : threadCreatedAt;
      const lastReplyAuthorId = lastReply ? userMap.get(lastReply.author) : null;

      const thread = await db.thread.create({
        data: {
          title: t.title,
          slug: baseSlug,
          body: t.body,
          authorId,
          categoryId,
          isPinned: !!t.pinned,
          isLocked: !!t.locked,
          views: t.views ?? Math.floor(Math.random() * 400 + 30),
          replyCount: replies.length,
          createdAt: threadCreatedAt,
          updatedAt: lastReplyAt,
          lastReplyAt,
          lastReplyAuthorId: lastReplyAuthorId ?? null,
        },
        select: { id: true },
      });
      threadCount++;

      // Reactions on the thread itself
      if (t.reactions) {
        await seedReactionsFor({
          threadId: thread.id,
          replyId: null,
          reactions: t.reactions,
          userMap,
        });
        reactionCount += Object.values(t.reactions).reduce(
          (s, n) => s + (n as number),
          0
        );
      }

      // Replies
      for (const r of replies) {
        const rAuthorId = userMap.get(r.author);
        if (!rAuthorId) continue;
        const rCreatedAt = daysAgo(r.daysAgo, 12);
        const reply = await db.reply.create({
          data: {
            body: r.body,
            authorId: rAuthorId,
            threadId: thread.id,
            createdAt: rCreatedAt,
            updatedAt: rCreatedAt,
          },
          select: { id: true },
        });
        replyCount++;
        if (r.reactions) {
          await seedReactionsFor({
            threadId: null,
            replyId: reply.id,
            reactions: r.reactions,
            userMap,
          });
          reactionCount += Object.values(r.reactions).reduce(
            (s, n) => s + (n as number),
            0
          );
        }
      }
    }
  }

  console.log(
    `[seed] created ${threadCount} threads, ${replyCount} replies, ${reactionCount} reactions`
  );
}

async function seedReactionsFor({
  threadId,
  replyId,
  reactions,
  userMap,
}: {
  threadId: string | null;
  replyId: string | null;
  reactions: Partial<Record<ReactionType, number>>;
  userMap: Map<string, string>;
}) {
  const allUserIds = Array.from(userMap.values());
  for (const [type, count] of Object.entries(reactions)) {
    if (!count) continue;
    // Pick unique random users to give this reaction
    const pickedIds = pickMany(allUserIds, Math.min(count, allUserIds.length));
    for (const userId of pickedIds) {
      try {
        await db.reaction.create({
          data: {
            type: type as ReactionType,
            userId,
            threadId,
            replyId,
          },
        });
      } catch {
        // Unique constraint may fire (already reacted) — safe to swallow
      }
    }
  }
}

async function recomputePostCounts() {
  console.log("[seed] recomputing post counts…");
  const seededUsers = await db.user.findMany({
    where: { email: { endsWith: SEED_EMAIL_SUFFIX } },
    select: { id: true },
  });
  for (const u of seededUsers) {
    const [threads, replies] = await Promise.all([
      db.thread.count({ where: { authorId: u.id } }),
      db.reply.count({ where: { authorId: u.id } }),
    ]);
    await db.user.update({
      where: { id: u.id },
      data: { postCount: threads + replies },
    });
  }
}

async function main() {
  console.log(`[seed] starting (DB: ${connectionString.replace(/:\/\/.*@/, "://***@")})`);
  await upsertUsers();
  await seedThreads();
  await recomputePostCounts();
  console.log("[seed] done.");
  await db.$disconnect();
}

main().catch((e) => {
  console.error("[seed] fatal:", e);
  process.exit(1);
});
