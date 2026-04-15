import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const VALID_ROLES = ["MEMBER", "MODERATOR", "ADMIN"] as const;
type Role = (typeof VALID_ROLES)[number];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, id: true },
  });
  if (me?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await params;
  if (userId === me.id) {
    return NextResponse.json(
      { error: "You can't change your own role." },
      { status: 400 }
    );
  }

  const body = (await req.json().catch(() => null)) as { role?: string } | null;
  const role = body?.role as Role | undefined;
  if (!role || !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const target = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, username: true },
  });
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await db.user.update({
    where: { id: userId },
    data: { role },
  });

  return NextResponse.json({ ok: true, userId, role });
}
