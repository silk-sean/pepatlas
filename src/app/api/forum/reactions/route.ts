import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { ReactionType } from "@prisma/client";

const VALID_TYPES: ReactionType[] = ["LIKE", "AGREE", "USEFUL", "FUNNY", "THANKS"];

interface Body {
  type?: string;
  threadId?: string;
  replyId?: string;
}

// POST /api/forum/reactions — toggle a reaction on a thread or reply.
// Idempotent: if reaction exists, remove it; otherwise create it.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const type = body.type as ReactionType;
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
  }

  const threadId = body.threadId || null;
  const replyId = body.replyId || null;
  if (!threadId && !replyId) {
    return NextResponse.json({ error: "threadId or replyId required" }, { status: 400 });
  }
  if (threadId && replyId) {
    return NextResponse.json({ error: "Only one of threadId or replyId" }, { status: 400 });
  }

  // Validate target exists
  if (threadId) {
    const exists = await db.thread.findUnique({ where: { id: threadId }, select: { id: true } });
    if (!exists) return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }
  if (replyId) {
    const exists = await db.reply.findUnique({ where: { id: replyId }, select: { id: true } });
    if (!exists) return NextResponse.json({ error: "Reply not found" }, { status: 404 });
  }

  // Check existing reaction
  const existing = await db.reaction.findFirst({
    where: {
      userId: session.user.id,
      type,
      ...(threadId ? { threadId } : { replyId }),
    },
  });

  if (existing) {
    // Toggle off
    await db.reaction.delete({ where: { id: existing.id } });
    return NextResponse.json({ ok: true, reacted: false });
  }

  await db.reaction.create({
    data: {
      type,
      userId: session.user.id,
      threadId,
      replyId,
    },
  });
  return NextResponse.json({ ok: true, reacted: true });
}
