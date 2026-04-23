import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { processGhostJobs } from "@/lib/ghost-engagement";

/**
 * POST /api/admin/forum/engage-now — processes ALL pending ghost jobs
 * immediately (bypasses scheduledFor). Admin can call this to flush
 * the queue manually.
 *
 * Body: { limit?: number }  default 15
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (me?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    limit?: number;
  } | null;

  const limit = Math.max(1, Math.min(50, Number(body?.limit ?? 15)));

  try {
    const result = await processGhostJobs({ limit, all: true });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = (e as Error).message || String(e);
    console.error("[admin/forum/engage-now] failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
