import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { freshenForum } from "@/lib/ghost-engagement";

/**
 * POST /api/admin/forum/freshen — kicks off a batch ghost-reply pass
 * to backdate recent activity across stale threads.
 *
 * Body: { threadsToTouch?, windowHours?, seedEmptyCategories? }
 *
 * This is slow (hits Claude N times). The request just returns once
 * everything is done. Typical: ~40 threads = 30-60 seconds.
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
    threadsToTouch?: number;
    windowHours?: number;
    seedEmptyCategories?: boolean;
  } | null;

  const threadsToTouch = Math.max(
    1,
    Math.min(100, Number(body?.threadsToTouch ?? 40))
  );
  const windowHours = Math.max(
    1,
    Math.min(168, Number(body?.windowHours ?? 48))
  );

  try {
    const result = await freshenForum({
      threadsToTouch,
      windowHours,
      seedEmptyCategories: body?.seedEmptyCategories !== false,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = (e as Error).message || String(e);
    console.error("[admin/forum/freshen] failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
