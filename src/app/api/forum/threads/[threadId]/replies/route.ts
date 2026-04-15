import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ threadId: string }>;
}

// POST /api/forum/threads/{threadId}/replies — add a reply
export async function POST(req: Request, ctx: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId } = await ctx.params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const bodyText = String(body.body || "").trim();
  const parentId = body.parentId ? String(body.parentId) : null;

  if (bodyText.length < 1 || bodyText.length > 50000) {
    return NextResponse.json(
      { error: "Reply must be 1-50,000 characters" },
      { status: 400 },
    );
  }

  const thread = await db.thread.findUnique({ where: { id: threadId } });
  if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  if (thread.isLocked) return NextResponse.json({ error: "Thread is locked" }, { status: 403 });

  if (parentId) {
    const parent = await db.reply.findUnique({ where: { id: parentId } });
    if (!parent || parent.threadId !== threadId) {
      return NextResponse.json(
        { error: "Parent reply not found" },
        { status: 404 },
      );
    }
  }

  const now = new Date();
  const [reply] = await db.$transaction([
    db.reply.create({
      data: {
        body: bodyText,
        authorId: session.user.id,
        threadId,
        parentId,
      },
      select: { id: true },
    }),
    // Update thread's denormalized counters + last reply info
    db.thread.update({
      where: { id: threadId },
      data: {
        updatedAt: now,
        lastReplyAt: now,
        lastReplyAuthorId: session.user.id,
        replyCount: { increment: 1 },
      },
    }),
    // Bump user post count
    db.user.update({
      where: { id: session.user.id },
      data: { postCount: { increment: 1 } },
    }),
  ]);

  return NextResponse.json({ ok: true, reply });
}
