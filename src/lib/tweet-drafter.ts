/**
 * Rule-based tweet draft generator. Reads forum activity + recent articles
 * and produces tweet candidates.
 *
 * Rule-based for now (no AI API cost, consistent output). Can swap the
 * template functions for LLM calls later if the vibe gets stale.
 */
import { db } from "@/lib/db";
import { getAllArticles, CATEGORY_META } from "@/lib/articles";
import { SITE_URL } from "@/lib/constants";

const MAX = 280;

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

function fit(body: string, url: string): string {
  // Tweet URLs are counted as 23 chars via Twitter's t.co shortener, but we'll
  // budget for the literal URL length to be safe.
  const urlPart = ` ${url}`;
  const remaining = MAX - urlPart.length;
  return truncate(body, remaining) + urlPart;
}

interface DraftCandidate {
  body: string;
  sourceType: "thread" | "article" | "stat" | "compound" | "manual";
  sourceId?: string;
}

async function hotThreadDrafts(): Promise<DraftCandidate[]> {
  // Threads with most activity in the last 14 days
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const threads = await db.thread.findMany({
    where: {
      OR: [{ lastReplyAt: { gte: since } }, { createdAt: { gte: since } }],
    },
    orderBy: [{ replyCount: "desc" }, { lastReplyAt: "desc" }],
    take: 6,
    select: {
      id: true,
      title: true,
      replyCount: true,
      category: { select: { slug: true, name: true } },
    },
  });

  const templates: ((t: typeof threads[number]) => string)[] = [
    (t) => `Active right now: "${t.title}" — ${t.replyCount} replies.`,
    (t) => `Community thread worth a read: "${t.title}"`,
    (t) => `${t.replyCount} replies and counting: ${t.title}`,
    (t) => `Thread of the week (${t.category.name}): ${t.title}`,
  ];

  return threads.map((t) => {
    const tpl = templates[Math.floor(Math.random() * templates.length)];
    const url = `${SITE_URL}/forum/${t.category.slug}/${t.id}`;
    return {
      body: fit(tpl(t), url),
      sourceType: "thread" as const,
      sourceId: t.id,
    };
  });
}

async function articleDrafts(): Promise<DraftCandidate[]> {
  const articles = getAllArticles();
  // Prefer featured or most recently published
  const sorted = [...articles].sort((a, b) => {
    const ap = a.frontmatter.featured ? 1 : 0;
    const bp = b.frontmatter.featured ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return (
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
    );
  });
  const picks = sorted.slice(0, 5);

  const templates: ((a: (typeof sorted)[number]) => string)[] = [
    (a) => `New on PepAtlas: ${a.frontmatter.title}. ${a.frontmatter.summary}`,
    (a) => `${a.frontmatter.title} — ${a.frontmatter.summary}`,
    (a) =>
      `Worth reading: ${a.frontmatter.title}. A look at ${
        CATEGORY_META[a.frontmatter.category].label.toLowerCase()
      }.`,
    (a) => `${CATEGORY_META[a.frontmatter.category].label}: ${a.frontmatter.title}`,
  ];

  return picks.map((a) => {
    const tpl = templates[Math.floor(Math.random() * templates.length)];
    const url = `${SITE_URL}/articles/${a.frontmatter.slug}`;
    return {
      body: fit(tpl(a), url),
      sourceType: "article" as const,
      sourceId: a.frontmatter.slug,
    };
  });
}

async function statDraft(): Promise<DraftCandidate | null> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [threadCount, replyCount] = await Promise.all([
    db.thread.count({ where: { createdAt: { gte: since } } }),
    db.reply.count({ where: { createdAt: { gte: since } } }),
  ]);
  if (threadCount === 0 && replyCount === 0) return null;
  const url = `${SITE_URL}/forum`;
  const body = fit(
    `This week on PepAtlas: ${threadCount} new threads, ${replyCount} replies. The peptide community moves forward.`,
    url
  );
  return { body, sourceType: "stat" };
}

async function compoundTeaser(): Promise<DraftCandidate | null> {
  // Pick a random compound article to tease
  const articles = getAllArticles().filter(
    (a) => a.frontmatter.category === "compounds"
  );
  if (articles.length === 0) return null;
  const a = articles[Math.floor(Math.random() * articles.length)];
  const url = `${SITE_URL}/articles/${a.frontmatter.slug}`;
  const body = fit(
    `People ask about ${a.frontmatter.title.split(":")[0]} constantly. Here's what the community's figured out.`,
    url
  );
  return {
    body,
    sourceType: "compound",
    sourceId: a.frontmatter.slug,
  };
}

/**
 * Generate N candidate tweets (mix of types). Inserts them as PENDING in DB.
 * Returns the created drafts.
 */
export async function generateDrafts(count = 5) {
  const pool: DraftCandidate[] = [];

  const hot = await hotThreadDrafts();
  pool.push(...hot);

  const arts = await articleDrafts();
  pool.push(...arts);

  const stat = await statDraft();
  if (stat) pool.push(stat);

  const compound = await compoundTeaser();
  if (compound) pool.push(compound);

  // Shuffle, then pick count unique-by-body
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const seen = new Set<string>();
  const picked: DraftCandidate[] = [];
  for (const c of shuffled) {
    if (seen.has(c.body)) continue;
    seen.add(c.body);
    picked.push(c);
    if (picked.length >= count) break;
  }

  // Filter out drafts whose sourceId already has a PENDING or POSTED draft
  // within the last 30 days (avoid duplicates).
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const fresh: DraftCandidate[] = [];
  for (const c of picked) {
    if (!c.sourceId) {
      fresh.push(c);
      continue;
    }
    const existing = await db.tweetDraft.findFirst({
      where: {
        sourceType: c.sourceType,
        sourceId: c.sourceId,
        generatedAt: { gte: thirtyDaysAgo },
        status: { in: ["PENDING", "APPROVED", "POSTED"] },
      },
      select: { id: true },
    });
    if (!existing) fresh.push(c);
  }

  const created = [];
  for (const c of fresh) {
    const d = await db.tweetDraft.create({
      data: {
        body: c.body,
        sourceType: c.sourceType,
        sourceId: c.sourceId ?? null,
      },
    });
    created.push(d);
  }
  return created;
}
