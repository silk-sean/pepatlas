import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ replyId: string }>;
}

// POST /api/forum/replies/[replyId]/delete — delete reply (author or mod)
export async function POST(_req: Request, ctx: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { replyId } = await ctx.params;
  const reply = await db.reply.findUnique({
    where: { id: replyId },
    select: { authorId: true, threadId: true },
  });
  if (!reply) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  const isAuthor = reply.authorId === session.user.id;
  const isMod = me?.role === "MODERATOR" || me?.role === "ADMIN";
  if (!isAuthor && !isMod) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.$transaction([
    db.reply.delete({ where: { id: replyId } }),
    db.thread.update({
      where: { id: reply.threadId },
      data: { replyCount: { decrement: 1 } },
    }),
    db.user.update({
      where: { id: reply.authorId },
      data: { postCount: { decrement: 1 } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
