import { NextRequest, NextResponse } from "next/server";
import { generateDrafts } from "@/lib/tweet-drafter";

/**
 * Daily tweet-draft generation cron.
 *
 * Called by droplet crontab with:
 *   curl -sS -X POST -H "x-cron-secret: $CRON_SECRET" \
 *     http://localhost:3000/api/cron/generate-drafts
 *
 * Generates a fresh batch of drafts so the admin queue is primed when
 * the user opens /admin/tweets.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  const expected = process.env.CRON_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const created = await generateDrafts(6);
    return NextResponse.json({
      ok: true,
      created: created.length,
      ids: created.map((d) => d.id),
    });
  } catch (e) {
    const msg = (e as Error).message || String(e);
    console.error("[cron/generate-drafts] failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
