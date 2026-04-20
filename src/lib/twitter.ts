import { TwitterApi } from "twitter-api-v2";

/**
 * Lazy X/Twitter client. Returns null if env vars missing so local dev doesn't
 * crash. In prod these live in /opt/pepatlas/.env on the droplet.
 */
function client(): TwitterApi | null {
  const {
    X_API_KEY,
    X_API_SECRET,
    X_ACCESS_TOKEN,
    X_ACCESS_TOKEN_SECRET,
  } = process.env;
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_TOKEN_SECRET) {
    return null;
  }
  return new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_TOKEN_SECRET,
  });
}

export interface PostTweetResult {
  ok: boolean;
  tweetId?: string;
  url?: string;
  error?: string;
}

export async function postTweet(text: string): Promise<PostTweetResult> {
  const c = client();
  if (!c) {
    return { ok: false, error: "X API credentials not configured" };
  }
  if (!text || text.length === 0) {
    return { ok: false, error: "Empty tweet body" };
  }
  if (text.length > 280) {
    return { ok: false, error: "Tweet exceeds 280 characters" };
  }
  try {
    const res = await c.v2.tweet(text);
    const id = res.data.id;
    return {
      ok: true,
      tweetId: id,
      url: `https://x.com/pepatlas/status/${id}`,
    };
  } catch (e) {
    const msg = (e as Error).message || String(e);
    console.error("[twitter] postTweet error:", msg);
    return { ok: false, error: msg };
  }
}

/** Dev-only: check the client can authenticate without posting anything. */
export async function verifyCredentials(): Promise<PostTweetResult> {
  const c = client();
  if (!c) return { ok: false, error: "Credentials not configured" };
  try {
    const me = await c.v2.me();
    return {
      ok: true,
      url: `https://x.com/${me.data.username}`,
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
