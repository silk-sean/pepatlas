import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

/**
 * Auto-stagger: take the top N PENDING drafts and schedule them at
 * equal intervals across a window.
 *
 * Body: { count: number, windowHours: number, startAt?: ISO string }
 * Default start = now. Drafts are scheduled at start, start+step,
 * start+2*step, ...  where step = windowHours / count (hours).
 * That keeps them evenly spaced without one landing at the end of the
 * window where it might not fit.
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
    count?: number;
    windowHours?: number;
    startAt?: string;
  } | null;

  const count = Math.max(1, Math.min(20, Number(body?.count ?? 6)));
  const windowHours = Math.max(
    0.25,
    Math.min(168, Number(body?.windowHours ?? 12))
  );

  const start = body?.startAt ? new Date(body.startAt) : new Date();
  if (isNaN(start.getTime())) {
    return NextResponse.json({ error: "Invalid startAt" }, { status: 400 });
  }

  // Grab oldest-first so your oldest-waiting candidates get sent first.
  // (Change to desc if you want latest-generated to drip first.)
  const pending = await db.tweetDraft.findMany({
    where: { status: "PENDING" },
    orderBy: { generatedAt: "asc" },
    take: count,
  });

  if (pending.length === 0) {
    return NextResponse.json({
      ok: false,
      error: "No pending drafts to stagger",
    });
  }

  const stepMs = (windowHours * 60 * 60 * 1000) / pending.length;

  const updates = await Promise.all(
    pending.map((d, i) => {
      const when = new Date(start.getTime() + i * stepMs);
      return db.tweetDraft.update({
        where: { id: d.id },
        data: { status: "APPROVED", scheduledFor: when },
      });
    })
  );

  return NextResponse.json({
    ok: true,
    scheduled: updates.length,
    firstAt: updates[0]?.scheduledFor,
    lastAt: updates[updates.length - 1]?.scheduledFor,
  });
}
