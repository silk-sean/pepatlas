/**
 * Tweet draft generator. Two modes:
 *
 *  1. AI (ANTHROPIC_API_KEY set): Claude generates tweet candidates from site
 *     context, steered by an optional freeform "direction" hint.
 *  2. Rule-based fallback (no API key): template-based generation, direction
 *     used as an optional keyword filter on which threads/articles to draw from.
 */
import { db } from "@/lib/db";
import { getAllArticles, CATEGORY_META } from "@/lib/articles";
import { SITE_URL } from "@/lib/constants";
import Anthropic from "@anthropic-ai/sdk";

const MAX_TWEET = 280;

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

function fit(body: string, url: string): string {
  const urlPart = ` ${url}`;
  const remaining = MAX_TWEET - urlPart.length;
  return truncate(body, remaining) + urlPart;
}

interface DraftCandidate {
  body: string;
  sourceType: "thread" | "article" | "stat" | "compound" | "manual" | "ai";
  sourceId?: string;
}

// ─── Gather site context (shared by both modes) ─────────────────────────────

async function gatherContext() {
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const [hotThreads, recentThreads, stats] = await Promise.all([
    db.thread.findMany({
      where: {
        OR: [{ lastReplyAt: { gte: since } }, { createdAt: { gte: since } }],
      },
      orderBy: [{ replyCount: "desc" }, { lastReplyAt: "desc" }],
      take: 12,
      select: {
        id: true,
        title: true,
        body: true,
        replyCount: true,
        category: { select: { slug: true, name: true } },
      },
    }),
    db.thread.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        body: true,
        category: { select: { slug: true, name: true } },
      },
    }),
    (async () => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const [threadCount, replyCount] = await Promise.all([
        db.thread.count({ where: { createdAt: { gte: weekAgo } } }),
        db.reply.count({ where: { createdAt: { gte: weekAgo } } }),
      ]);
      return { threadCount, replyCount };
    })(),
  ]);

  const articles = getAllArticles();
  const featuredArticles = articles.filter((a) => a.frontmatter.featured);
  const recentArticles = [...articles]
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime()
    )
    .slice(0, 10);

  return { hotThreads, recentThreads, stats, featuredArticles, recentArticles };
}

// ─── AI-driven generation ───────────────────────────────────────────────────

async function generateWithAI(
  count: number,
  direction?: string
): Promise<DraftCandidate[]> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return [];

  const ctx = await gatherContext();

  // Format site content as compact context for Claude
  const hotThreadLines = ctx.hotThreads.slice(0, 8).map((t) => {
    const url = `${SITE_URL}/forum/${t.category.slug}/${t.id}`;
    return `- [${t.category.name}] "${t.title}" (${t.replyCount} replies) ${url}`;
  });

  const articleLines = [
    ...ctx.featuredArticles.slice(0, 3),
    ...ctx.recentArticles.slice(0, 6),
  ]
    .filter((v, i, arr) => arr.findIndex((x) => x.frontmatter.slug === v.frontmatter.slug) === i)
    .slice(0, 8)
    .map((a) => {
      const cat = CATEGORY_META[a.frontmatter.category].label;
      const url = `${SITE_URL}/articles/${a.frontmatter.slug}`;
      return `- [${cat}] "${a.frontmatter.title}" — ${a.frontmatter.summary} ${url}`;
    });

  const directionBlock = direction?.trim()
    ? `\n\n### USER DIRECTION — THIS TAKES PRIORITY OVER DEFAULT BEHAVIOR:\n"${direction.trim()}"\n\nRespect this direction literally. If it asks for an intro tweet, write an intro tweet (don't just find an existing thread that's "intro-like"). If it asks to push a specific article, link to that article. If it asks for a certain tone, use that tone. Direction > defaults.\n`
    : "";

  const systemPrompt = `You write tweets for @pepatlas on X.

PepAtlas is a peptide research community and discussion forum at pepatlas.com. Editorial stance: community-first, no-hype, not a vendor, not selling anything. Audience is biohackers, researchers, and people genuinely curious about peptides — they value honesty and dislike marketing tone.

Default behavior (when no user direction is given): draft tweets that highlight recent threads, articles, or community activity from the context provided.

When a user direction IS given, respect it literally — the direction describes the TYPE and PURPOSE of tweet they want, and you follow that even if it means writing tweets that are NOT tied to a specific thread or article.

URL options for each tweet:
- For a specific thread: use the thread URL from context (https://pepatlas.com/forum/...)
- For a specific article: use the article URL from context (https://pepatlas.com/articles/...)
- For meta/intro/announcement tweets (no specific content to link): use https://pepatlas.com or https://pepatlas.com/forum
- A tweet without a URL is allowed if the direction calls for pure brand voice

Rules for every tweet you generate:
- Under 280 characters TOTAL including the URL
- No hashtags unless truly apt (sparingly)
- No emojis unless the tweet is clearly playful/meta
- Don't use the word "peptide" more than once per tweet — it trips X's sensitive content filters
- Never use "buy", "sell", "shop", "discount", "vendor" — we're not selling anything
- Don't promise outcomes ("lose 20 lbs!")
- Skip hype words: "revolutionary", "game-changer", "unlock"
- Voice: direct, smart, a little dry, sounds like a knowledgeable forum regular
- Tweets should feel distinctive from each other — don't start 6 tweets with "New on PepAtlas:"
- If a thread title is already a question, just reference it; don't reframe

Output format: ONLY a raw JSON array of tweets, no markdown fences, no prose. Each tweet is an object:
{
  "body": "<the full tweet text, INCLUDING the URL at the end if one is used>",
  "sourceType": "thread" | "article" | "stat" | "compound" | "meta" | "manual",
  "sourceId": "<the thread ID or article slug if applicable — null for meta/manual>"
}

Use sourceType "meta" when the tweet is a brand/intro/announcement not tied to a specific piece of content. Use "manual" when the user direction is so specific it's basically a composed tweet.

The "body" field must be the full tweet text ready to post.`;

  const userPrompt = `Generate ${count} tweet candidates. Mix thread and article sources. Vary tone. Make them feel like different tweets, not templates.

### CURRENT ACTIVE THREADS (last 14 days, sorted by activity):
${hotThreadLines.join("\n") || "(none)"}

### RECENTLY POSTED THREADS:
${ctx.recentThreads
  .slice(0, 5)
  .map(
    (t) =>
      `- [${t.category.name}] "${t.title}" ${SITE_URL}/forum/${t.category.slug}/${t.id}`
  )
  .join("\n") || "(none)"}

### ARTICLES YOU CAN REFERENCE:
${articleLines.join("\n") || "(none)"}

### THIS WEEK STATS:
- ${ctx.stats.threadCount} new threads, ${ctx.stats.replyCount} replies
${directionBlock}

Return ONLY a JSON array. No preface, no code fences, no trailing commentary.`;

  const client = new Anthropic({ apiKey: key });
  const res = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text =
    res.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n") ?? "";

  // Strip any code fences Claude might stubbornly include
  const clean = text
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/```\s*$/m, "")
    .trim();

  let parsed: Array<{ body?: string; sourceType?: string; sourceId?: string }>;
  try {
    parsed = JSON.parse(clean);
  } catch (e) {
    console.error("[tweet-drafter] AI response not valid JSON:", clean.slice(0, 500));
    throw new Error("AI returned malformed JSON — try generating again.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("AI didn't return an array");
  }

  const out: DraftCandidate[] = [];
  for (const p of parsed) {
    const body = (p.body ?? "").trim();
    if (!body) continue;
    if (body.length > MAX_TWEET) continue;
    const sourceType = (p.sourceType ?? "ai") as DraftCandidate["sourceType"];
    out.push({
      body,
      sourceType,
      sourceId: p.sourceId ?? undefined,
    });
  }
  return out;
}

// ─── Rule-based fallback ────────────────────────────────────────────────────

function matchesDirection(text: string, direction?: string): boolean {
  if (!direction) return true;
  const keywords = direction
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((w) => w.length > 3);
  if (keywords.length === 0) return true;
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

async function generateRuleBased(
  count: number,
  direction?: string
): Promise<DraftCandidate[]> {
  const ctx = await gatherContext();
  const pool: DraftCandidate[] = [];

  // Hot threads
  const threadTemplates = [
    (t: { title: string; replyCount: number; category: { name: string } }) =>
      `Active discussion: "${t.title}" — ${t.replyCount} replies.`,
    (t: { title: string; category: { name: string } }) =>
      `Worth a read: "${t.title}"`,
    (t: { title: string; category: { name: string } }) =>
      `${t.category.name} thread of note: ${t.title}`,
  ];
  for (const t of ctx.hotThreads) {
    const summary = `${t.title} ${t.body}`;
    if (!matchesDirection(summary, direction)) continue;
    const tpl = threadTemplates[Math.floor(Math.random() * threadTemplates.length)];
    const url = `${SITE_URL}/forum/${t.category.slug}/${t.id}`;
    pool.push({
      body: fit(tpl(t), url),
      sourceType: "thread",
      sourceId: t.id,
    });
  }

  // Articles
  const articleTemplates = [
    (a: { frontmatter: { title: string; summary: string } }) =>
      `${a.frontmatter.title}. ${a.frontmatter.summary}`,
    (a: { frontmatter: { title: string } }) =>
      `From PepAtlas: ${a.frontmatter.title}`,
  ];
  for (const a of ctx.recentArticles) {
    const text = `${a.frontmatter.title} ${a.frontmatter.summary} ${(a.frontmatter.tags ?? []).join(" ")}`;
    if (!matchesDirection(text, direction)) continue;
    const tpl = articleTemplates[Math.floor(Math.random() * articleTemplates.length)];
    const url = `${SITE_URL}/articles/${a.frontmatter.slug}`;
    pool.push({
      body: fit(tpl(a), url),
      sourceType: "article",
      sourceId: a.frontmatter.slug,
    });
  }

  // Stats (only if no direction, or direction mentions forum/community)
  if (
    !direction ||
    matchesDirection("forum community discussion activity stats", direction)
  ) {
    if (ctx.stats.threadCount > 0) {
      pool.push({
        body: fit(
          `This week on PepAtlas: ${ctx.stats.threadCount} new threads, ${ctx.stats.replyCount} replies.`,
          `${SITE_URL}/forum`
        ),
        sourceType: "stat",
      });
    }
  }

  // Shuffle + dedupe
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const seen = new Set<string>();
  const unique: DraftCandidate[] = [];
  for (const c of shuffled) {
    if (seen.has(c.body)) continue;
    seen.add(c.body);
    unique.push(c);
    if (unique.length >= count) break;
  }
  return unique;
}

// ─── Public API: generate + persist ─────────────────────────────────────────

export async function generateDrafts(count = 6, direction?: string) {
  let candidates: DraftCandidate[] = [];
  const haveAIKey = Boolean(process.env.ANTHROPIC_API_KEY);
  const aiRanSuccessfully = { value: false };

  if (haveAIKey) {
    try {
      candidates = await generateWithAI(count, direction);
      aiRanSuccessfully.value = candidates.length > 0;
    } catch (e) {
      console.error("[tweet-drafter] AI failed, falling back to rule-based:", e);
    }
  }

  // Top up with rule-based ONLY if AI completely failed OR no direction was given.
  // If a direction was given and AI returned some drafts, trust Claude — don't
  // pollute the batch with generic rule-based drafts that ignore intent.
  const shouldTopUp =
    candidates.length < count &&
    (!direction || !aiRanSuccessfully.value);

  if (shouldTopUp) {
    const remaining = count - candidates.length;
    const rb = await generateRuleBased(remaining, direction);
    candidates.push(...rb);
  }

  // Dedupe against existing drafts in last 30 days by sourceId
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const fresh: DraftCandidate[] = [];
  for (const c of candidates) {
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
  for (const c of fresh.slice(0, count)) {
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
