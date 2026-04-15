import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    title?: string;
    body?: string;
    date?: string;
    tags?: string[];
  } | null;

  const title = (body?.title ?? "").trim();
  const text = (body?.body ?? "").trim();
  const dateStr = body?.date ?? "";
  const tags = Array.isArray(body?.tags) ? body!.tags.slice(0, 10) : [];

  if (!title || !text) {
    return NextResponse.json({ error: "Title and body required" }, { status: 400 });
  }
  if (title.length > 160 || text.length > 4000) {
    return NextResponse.json({ error: "Too long" }, { status: 400 });
  }
  const date = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const created = await db.journalEntry.create({
    data: {
      userId: session.user.id,
      title,
      body: text,
      date,
      tags,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: created.id });
}
