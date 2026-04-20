import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { postTweet } from "@/lib/twitter";

/**
 * Scheduled tweet poster. Hit hourly by droplet crontab:
 *   curl -sS -X POST -H "x-cron-secret: $CRON_SECRET" \
 *     http://localhost:3000/api/cron/post-scheduled
 *
 * Finds any APPROVED drafts whose scheduledFor <= now and posts them.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  const expected = process.env.CRON_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const due = await db.tweetDraft.findMany({
    where: {
      status: "APPROVED",
      scheduledFor: { lte: now },
    },
    orderBy: { scheduledFor: "asc" },
    take: 10, // cap per run to avoid runaways
  });

  const results: Array<{ id: string; ok: boolean; error?: string; tweetUrl?: string }> = [];

  for (const draft of due) {
    const res = await postTweet(draft.body);
    if (res.ok) {
      await db.tweetDraft.update({
        where: { id: draft.id },
        data: {
          status: "POSTED",
          postedAt: new Date(),
          tweetId: res.tweetId ?? null,
          tweetUrl: res.url ?? null,
        },
      });
      results.push({ id: draft.id, ok: true, tweetUrl: res.url });
    } else {
      await db.tweetDraft.update({
        where: { id: draft.id },
        data: {
          status: "FAILED",
          errorMessage: res.error ?? "unknown",
        },
      });
      results.push({ id: draft.id, ok: false, error: res.error });
    }
  }

  return NextResponse.json({
    ok: true,
    processed: results.length,
    results,
  });
}
