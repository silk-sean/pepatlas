import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const VALID_TYPES = ["thread", "article", "protocol"];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    type?: string;
    targetId?: string;
    action?: "add" | "remove" | "toggle";
  } | null;

  const type = body?.type ?? "";
  const targetId = body?.targetId ?? "";
  const action = body?.action ?? "toggle";

  if (!VALID_TYPES.includes(type) || !targetId) {
    return NextResponse.json({ error: "Invalid type or id" }, { status: 400 });
  }

  const key = {
    userId_type_targetId: {
      userId: session.user.id,
      type,
      targetId,
    },
  };

  if (action === "add") {
    try {
      await db.bookmark.create({
        data: { userId: session.user.id, type, targetId },
      });
    } catch {
      /* already exists */
    }
    return NextResponse.json({ ok: true, bookmarked: true });
  }
  if (action === "remove") {
    await db.bookmark.delete({ where: key }).catch(() => undefined);
    return NextResponse.json({ ok: true, bookmarked: false });
  }

  // toggle
  const existing = await db.bookmark.findUnique({ where: key });
  if (existing) {
    await db.bookmark.delete({ where: key });
    return NextResponse.json({ ok: true, bookmarked: false });
  }
  await db.bookmark.create({
    data: { userId: session.user.id, type, targetId },
  });
  return NextResponse.json({ ok: true, bookmarked: true });
}
