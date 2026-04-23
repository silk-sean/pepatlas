/**
 * Ghost forum content generator. Uses Claude Haiku to draft replies and
 * starter threads that sound like real forum members, with explicit
 * anti-"AI voice" guidance:
 *  - no em dashes
 *  - occasional human typos / loose grammar
 *  - disagreement and skepticism welcome
 *  - no vendor/sourcing chatter
 */
import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-haiku-4-5";

// ─── Shared voice guidance ──────────────────────────────────────────────────

const HUMAN_VOICE = `
Write like a real forum member, not a content generator. Rules:

- NO em dashes (—). Use commas, periods, or just start a new sentence. Em dashes are the #1 tell that something was written by AI.
- NO semicolons either (same vibe).
- Casual punctuation is fine. Lowercase after a period is fine sometimes. Missing apostrophes (dont, wasnt, youre) are fine occasionally.
- One typo or slightly off grammar every 2-3 replies is GOOD. "I ran it for like 4 week" or "worked for me tho" or "probs" etc.
- Don't write in tidy 3-paragraph essays. Real forum replies are 1-4 sentences usually. Sometimes a single line. Sometimes a rambling 6 lines. Vary.
- No intro filler like "Great thread!" or "Thanks for sharing!" — real people just jump in.
- Disagree when you have reason to. Real forums argue. Gentle pushback, "eh I don't buy that," "nah mine was different," are all fine.
- Strong opinions are fine. Cocky takes are fine.
- No vendor or sourcing talk. Do NOT mention where to buy, who to source from, specific company names, or "I use X brand." If someone asks about sourcing, deflect: "not allowed to talk about that here" or similar.
- No medical claims that promise outcomes ("this will fix your gut"). Stick to "worked for me," "didn't notice anything," "YMMV."
- Slang and jargon used in r/Peptides, r/Steroids, and r/Biohackers is fine and welcome (gear, stack, sides, subq, protocol, bro-science, BCAA'd, jawlifted, etc). Don't overdo it.
- Don't end every reply with a question. Mix statements, opinions, anecdotes, occasional Q&A.
- Avoid: "I think," "In my experience," "Just my two cents," "Hope this helps" — those scream Reddit-politeness-bot.
`.trim();

interface GhostDraftRequest {
  threadTitle: string;
  threadBody: string;
  existingReplies: { author: string; body: string }[]; // most-recent first
  isReplyingTo?: { author: string; body: string };     // set for child replies
  directive?: string; // optional steer: "be skeptical", "agree and add detail"
}

export interface GhostReplyResult {
  body: string;
}

// Stable list of "persona" steers picked randomly to vary voices.
const PERSONA_STEERS = [
  "Newer to peptides, curious and slightly cautious.",
  "Has been at this for years, a little jaded.",
  "Data-driven, likes bloodwork and numbers, gets irritated by vibes-posting.",
  "Bro-ish, casual, heavy on slang.",
  "Measured and thoughtful, reads studies.",
  "Skeptical of everything, plays devil's advocate.",
  "Shares own experience without preaching.",
  "Short-poster, rarely writes more than 2 sentences.",
  "Wanders off-topic but in a charming way.",
  "Blunt, no-bs, calls out bad takes directly.",
  "Methodology stickler, always asks about control groups or baseline.",
  "Cheerful without being saccharine.",
];

function pickSteer(): string {
  return PERSONA_STEERS[Math.floor(Math.random() * PERSONA_STEERS.length)];
}

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

// ─── Public: draft a reply ──────────────────────────────────────────────────

export async function draftGhostReply(
  req: GhostDraftRequest
): Promise<GhostReplyResult | null> {
  const client = getClient();
  if (!client) return null;

  const steer = pickSteer();
  const context = req.existingReplies
    .slice(0, 5)
    .reverse() // oldest first for narrative flow
    .map((r) => `@${r.author}: ${r.body}`)
    .join("\n\n");

  const replyTarget = req.isReplyingTo
    ? `You are replying directly to this reply from @${req.isReplyingTo.author}:\n"${req.isReplyingTo.body}"`
    : "You are replying at the thread level (not to a specific reply).";

  const userPrompt = `
THREAD: "${req.threadTitle}"
ORIGINAL POST:
${req.threadBody}

${context ? `RECENT REPLIES IN THIS THREAD (oldest to newest):\n${context}\n` : ""}
${replyTarget}

Your persona for this reply: ${steer}
${req.directive ? `Extra steer: ${req.directive}` : ""}

Write a single forum reply. 1 to 4 sentences usually, occasionally longer if it fits. Follow the voice rules strictly. Do NOT use em dashes.

Output ONLY the reply text. No quotes, no preface, no "Here's my reply:" — just the reply body as it would appear on the forum.
`.trim();

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: HUMAN_VOICE,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("\n")
    .trim();

  if (!text) return null;

  // Strip any accidental surrounding quotes or em dashes that slipped through.
  const cleaned = text
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/—/g, ", ")
    .replace(/–/g, "-")
    .trim();

  return { body: cleaned };
}

// ─── Public: draft a starter thread for empty/stale categories ──────────────

export interface GhostThreadDraft {
  title: string;
  body: string;
}

export async function draftGhostThread(opts: {
  categoryName: string;
  categorySlug: string;
  hintTopic?: string;
}): Promise<GhostThreadDraft | null> {
  const client = getClient();
  if (!client) return null;

  const steer = pickSteer();
  const userPrompt = `
Write a starter thread for the "${opts.categoryName}" subforum on PepAtlas (a peptide research community).
${opts.hintTopic ? `Topic hint: ${opts.hintTopic}` : ""}

Your persona: ${steer}

Output a JSON object with exactly these keys:
{
  "title": "<thread title, 30-80 chars, lowercase or mixed case is fine, no clickbait>",
  "body": "<the original post, 2-6 sentences, casual forum voice, follows all voice rules>"
}

ONLY the JSON object. No prose, no code fences.
  `.trim();

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 700,
    system: HUMAN_VOICE,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("\n")
    .trim();

  const clean = text
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/```\s*$/m, "")
    .trim();

  try {
    const parsed = JSON.parse(clean) as { title?: string; body?: string };
    if (!parsed.title || !parsed.body) return null;
    const title = parsed.title.replace(/—/g, ", ").trim().slice(0, 140);
    const body = parsed.body.replace(/—/g, ", ").trim();
    if (title.length < 10 || body.length < 20) return null;
    return { title, body };
  } catch {
    return null;
  }
}
