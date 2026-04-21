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

  const hasDirection = Boolean(direction?.trim());

  const systemPrompt = `You write tweets for @pepatlas on X.

PepAtlas is a peptide research community and discussion forum at pepatlas.com. Editorial stance: community-first, no-hype, not a vendor, not selling anything. Audience is biohackers, researchers, and people curious about peptides. They dislike marketing tone and spot hype instantly.

## ABSOLUTE RULE: NO INVENTED CONTENT
Do not make up threads, posts, users, numbers, studies, results, or timelines. If the user asks for a tweet and you don't have a real piece of content from the provided context to reference, write a tweet that does NOT reference any specific content — a brand/community/idea tweet. Never fabricate a post like "Someone just shared their 12-week log" unless that log is explicitly in the context below.

## HOW TO READ THE USER'S DIRECTION
The user's direction is usually a VIBE, REFERENCE, or INTENT — not a literal keyword to pattern-match. Read it the way a smart copywriter would. Examples:
- "hello world Tiger Woods back in the 90s, this is our first impression" → Read as: bold, confident debut, culturally sharp, quiet swagger. Don't literally write about Tiger Woods or say "hello world."
- "be dryer, less marketing" → Strip hype words, shorten, sound like a forum post not an ad.
- "push the sermorelin article" → All tweets aim at that one article from different angles.
- "something funny" → Actually be funny. Not corporate-funny.
Write tweets that FEEL like what the user described. Match the vibe, don't parrot the words.

## DON'T BE A TEMPLATE
Copy-paste-tier phrases to avoid: "Dive into", "Join the conversation", "Discover", "Explore", "Welcome to", "Introducing", "Unlock", "the future of", "game-changing", "next level". Write like a real person on X, not a LinkedIn post.

## Voice
- Direct, smart, a touch dry. Sounds like a knowledgeable forum regular, not a brand.
- Never uses "buy", "sell", "shop", "discount", "vendor", "game-changer", "revolutionary", "unlock".
- Doesn't promise outcomes.
- Uses "peptide" at most once per tweet (sensitive-content filters).
- Hashtags: 0–2 max per tweet, and ONLY when the tag is genuinely topical and specific. X's algorithm demotes hashtag-stuffed tweets as spam. Good tags for this niche when relevant: #BPC157, #tirzepatide, #semaglutide, #GLP1, #peptides, #biohacking, #nootropics, #TRT, #longevity. Skip broad/useless ones (#wellness, #health, #fitness). Most tweets should have zero hashtags. Never stack 3+ hashtags.
- No emojis unless the tweet is playful.

## Hard format
- **Target length: 80–160 characters including any URL.** Short and punchy wins on X. Long tweets get scrolled past.
- **Hard cap 220 chars.** Never go over that. Do not pad to fill space.
- One idea per tweet. Usually 1–2 short sentences. No run-ons.
- Strong opener — the first 5 words decide whether the reader keeps scrolling. Lead with the interesting part.
- Cut filler: "I think," "just a reminder," "as we all know," "in this post," etc. Delete anything that isn't load-bearing.
- **Use standard sentence capitalization.** First word of every sentence capitalized. Proper nouns capitalized. Do NOT lowercase-first.
- Every tweet in the batch should feel distinct — don't open multiple tweets with the same phrasing.

## URLs: default to NO URL (X demotes tweets with links)

The default for every tweet is NO URL. Tweets without URLs get dramatically more reach because X's algorithm penalizes off-platform links. Your job is to build voice and audience, not drive clicks.

Rules:
- **Default: no URL.** Write the tweet standalone — just the idea, the hook, the observation.
- **Only include a URL if:** the tweet is specifically discussing/pointing at ONE piece of content from the reference context AND a reader would genuinely want to click through to read more (not a vague "learn more" — an actual specific thing). In that narrow case, link to that exact thread/article URL.
- **Never use https://pepatlas.com as filler.** No URL beats a filler URL every time.
- **Target: AT MOST 1 out of ${count} tweets should have a URL.** Ideally zero. If you find yourself adding a link to pad out a tweet, delete the link.
- Brand / announcement / voice / hot-take / observation / joke tweets should ALWAYS be URL-free.

## Output
ONLY a raw JSON array. No markdown fences, no prose. Each item:
{
  "body": "<full tweet text INCLUDING any URL>",
  "sourceType": "thread" | "article" | "meta" | "stat",
  "sourceId": "<thread ID or article slug if the tweet references one, else null>"
}

Use "meta" for brand/intro/community tweets not tied to specific content. Use "thread" or "article" ONLY if you're referencing a specific item from the provided context.`;

  // Build the user prompt. When direction is given, direction goes FIRST and
  // site context is minimized — context is a reference, not a menu.
  let userPrompt: string;

  if (hasDirection) {
    const hasRealContent = hotThreadLines.length > 0 || articleLines.length > 0;
    const contextBlock = hasRealContent
      ? `\n\n---\nReference context (use ONLY if the direction explicitly asks to reference site content; otherwise ignore):\n${
          hotThreadLines.length > 0
            ? `\nExisting threads:\n${hotThreadLines.slice(0, 5).join("\n")}`
            : ""
        }${
          articleLines.length > 0
            ? `\n\nExisting articles:\n${articleLines.slice(0, 5).join("\n")}`
            : ""
        }`
      : "";

    userPrompt = `DIRECTION FROM THE USER — this is the brief for ALL ${count} tweets in the batch:

"${direction!.trim()}"

Write ${count} tweets that serve this direction. Each tweet should be a different angle/phrasing on the same brief — not ${count - 1} on-brief + 1 random content highlight.

If the direction doesn't ask for a thread or article link, DON'T invent one and DON'T pull one from the reference context. A tweet without a URL (or with just https://pepatlas.com) is fine.${contextBlock}

Return the JSON array now.`;
  } else {
    userPrompt = `Generate ${count} tweet candidates. Mix thread and article sources. Vary tone. Make them feel distinct.

### CURRENT ACTIVE THREADS (last 14 days, sorted by activity):
${hotThreadLines.join("\n") || "(none)"}

### RECENTLY POSTED THREADS:
${
  ctx.recentThreads
    .slice(0, 5)
    .map(
      (t) =>
        `- [${t.category.name}] "${t.title}" ${SITE_URL}/forum/${t.category.slug}/${t.id}`
    )
    .join("\n") || "(none)"
}

### ARTICLES YOU CAN REFERENCE:
${articleLines.join("\n") || "(none)"}

### THIS WEEK STATS:
- ${ctx.stats.threadCount} new threads, ${ctx.stats.replyCount} replies

Return ONLY a JSON array.`;
  }

  // Sonnet when direction is given (better instruction adherence). Haiku
  // otherwise (cheaper, fine for templated content pulls).
  const model = hasDirection ? "claude-sonnet-4-5" : "claude-haiku-4-5";

  const client = new Anthropic({ apiKey: key });
  const res = await client.messages.create({
    model,
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[tweet-drafter] model=${model} direction=${hasDirection ? JSON.stringify(direction) : "(none)"}`
    );
  }

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
