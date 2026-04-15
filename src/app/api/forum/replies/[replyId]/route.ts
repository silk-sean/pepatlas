import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ replyId: string }>;
}

// PATCH /api/forum/replies/[replyId] — edit reply body (author or mod/admin only)
export async function PATCH(req: Request, ctx: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { replyId } = await ctx.params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const newBody = String(body.body || "").trim();
  if (newBody.length < 1 || newBody.length > 50000) {
    return NextResponse.json({ error: "Body must be 1-50,000 characters" }, { status: 400 });
  }

  const reply = await db.reply.findUnique({
    where: { id: replyId },
    select: { authorId: true, threadId: true },
  });
  if (!reply) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const me = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  const isAuthor = reply.authorId === session.user.id;
  const isMod = me?.role === "MODERATOR" || me?.role === "ADMIN";
  if (!isAuthor && !isMod) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.reply.update({
    where: { id: replyId },
    data: { body: newBody, editedAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}
