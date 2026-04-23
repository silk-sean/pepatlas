import { NextRequest, NextResponse } from "next/server";
import { processGhostJobs } from "@/lib/ghost-engagement";

/**
 * POST /api/cron/process-ghost-jobs — cron-only.
 *
 * Processes any GhostReplyJob rows whose scheduledFor <= now.
 * Capped at 15 per run to bound latency + API cost per run.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  const expected = process.env.CRON_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await processGhostJobs({ limit: 15 });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = (e as Error).message || String(e);
    console.error("[cron/process-ghost-jobs] failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
