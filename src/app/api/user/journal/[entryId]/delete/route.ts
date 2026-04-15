import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { entryId } = await params;
  const entry = await db.journalEntry.findUnique({
    where: { id: entryId },
    select: { userId: true },
  });
  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (entry.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await db.journalEntry.delete({ where: { id: entryId } });
  redirect("/dashboard/logs");
}
