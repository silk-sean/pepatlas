import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ threadId: string }>;
}

// PATCH /api/forum/threads/[threadId] — edit thread (author or mod)
export async function PATCH(req: Request, ctx: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId } = await ctx.params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const thread = await db.thread.findUnique({
    where: { id: threadId },
    select: { authorId: true },
  });
  if (!thread) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const me = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  const isAuthor = thread.authorId === session.user.id;
  const isMod = me?.role === "MODERATOR" || me?.role === "ADMIN";

  const data: { title?: string; body?: string; isPinned?: boolean; isLocked?: boolean } = {};

  // Any of these can be sent; we validate + permission-check each individually.
  if (body.title !== undefined) {
    if (!isAuthor && !isMod) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const title = String(body.title).trim();
    if (title.length < 3 || title.length > 200) {
      return NextResponse.json({ error: "Title must be 3-200 characters" }, { status: 400 });
    }
    data.title = title;
  }
  if (body.body !== undefined) {
    if (!isAuthor && !isMod) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const b = String(body.body).trim();
    if (b.length < 10 || b.length > 50000) {
      return NextResponse.json({ error: "Body must be 10-50,000 characters" }, { status: 400 });
    }
    data.body = b;
  }
  if (body.isPinned !== undefined) {
    if (!isMod) return NextResponse.json({ error: "Mod only" }, { status: 403 });
    data.isPinned = Boolean(body.isPinned);
  }
  if (body.isLocked !== undefined) {
    if (!isMod) return NextResponse.json({ error: "Mod only" }, { status: 403 });
    data.isLocked = Boolean(body.isLocked);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  await db.thread.update({ where: { id: threadId }, data });
  return NextResponse.json({ ok: true });
}
