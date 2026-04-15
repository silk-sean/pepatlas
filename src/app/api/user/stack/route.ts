import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isValidStack } from "@/lib/stack";

// POST /api/user/stack — update current user's stack signature
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !isValidStack(body)) {
    return NextResponse.json({ error: "Invalid stack format" }, { status: 400 });
  }

  const stamped = { ...body, updatedAt: new Date().toISOString() };
  await db.user.update({
    where: { id: session.user.id },
    // Prisma's Json input type is strict — cast is safe since we validated above.
    data: { stackJson: stamped as unknown as object },
  });
  return NextResponse.json({ ok: true, stack: stamped });
}

// DELETE /api/user/stack — clear stack signature
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await db.user.update({
    where: { id: session.user.id },
    data: { stackJson: Prisma.JsonNull },
  });
  return NextResponse.json({ ok: true });
}
