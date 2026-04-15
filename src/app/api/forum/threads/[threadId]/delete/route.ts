import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ threadId: string }>;
}

// POST /api/forum/threads/[threadId]/delete — delete thread (author or mod)
// We use POST (not DELETE) so it works from HTML forms without extra JS.
export async function POST(_req: Request, ctx: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { threadId } = await ctx.params;
  const thread = await db.thread.findUnique({
    where: { id: threadId },
    select: { authorId: true, replyCount: true, categoryId: true },
  });
  if (!thread) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  const isAuthor = thread.authorId === session.user.id;
  const isMod = me?.role === "MODERATOR" || me?.role === "ADMIN";
  if (!isAuthor && !isMod) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Decrement author's post count — deleting OP reverses their +1
  await db.$transaction([
    db.thread.delete({ where: { id: threadId } }),
    db.user.update({
      where: { id: thread.authorId },
      data: { postCount: { decrement: 1 } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
