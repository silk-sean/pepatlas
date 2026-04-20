import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (me?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Bulk-reject everything currently PENDING or FAILED. Posted/Approved stay.
  const res = await db.tweetDraft.updateMany({
    where: { status: { in: ["PENDING", "FAILED"] } },
    data: { status: "REJECTED" },
  });

  return NextResponse.json({ ok: true, rejected: res.count });
}
