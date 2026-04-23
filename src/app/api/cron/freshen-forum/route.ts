import { NextRequest, NextResponse } from "next/server";
import { freshenForum } from "@/lib/ghost-engagement";

/**
 * POST /api/cron/freshen-forum — cron/ops-only (secret-protected).
 *
 * Body: { threadsToTouch?, windowHours?, seedEmptyCategories? }
 *
 * Equivalent to /api/admin/forum/freshen but gated by CRON_SECRET so it
 * can be called from droplet crontab or ops scripts without an admin
 * session cookie.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  const expected = process.env.CRON_SECRET;
  if (!expected || secret !== expected) {
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
    console.error("[cron/freshen-forum] failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
