import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ threadId: string }>;
}

// POST /api/forum/threads/[threadId]/subscribe — toggle subscription
export async function POST(_req: Request, ctx: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { threadId } = await ctx.params;

  const thread = await db.thread.findUnique({ where: { id: threadId }, select: { id: true } });
  if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 });

  const existing = await db.threadSubscription.findUnique({
    where: { userId_threadId: { userId: session.user.id, threadId } },
  });
  if (existing) {
    await db.threadSubscription.delete({ where: { id: existing.id } });
    return NextResponse.json({ ok: true, subscribed: false });
  }
  await db.threadSubscription.create({
    data: { userId: session.user.id, threadId },
  });
  return NextResponse.json({ ok: true, subscribed: true });
}
