import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    name?: string;
    data?: Record<string, unknown>;
  } | null;

  const name = (body?.name ?? "").trim();
  const data = body?.data ?? {};
  if (!name || name.length > 80) {
    return NextResponse.json({ error: "Name required (max 80)" }, { status: 400 });
  }
  if (typeof data !== "object" || Array.isArray(data)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const created = await db.savedProtocol.create({
    data: {
      userId: session.user.id,
      name,
      data: data as object,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: created.id });
}
