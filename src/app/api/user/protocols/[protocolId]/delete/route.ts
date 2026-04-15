import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ protocolId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { protocolId } = await params;
  const proto = await db.savedProtocol.findUnique({
    where: { id: protocolId },
    select: { userId: true },
  });
  if (!proto) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (proto.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await db.savedProtocol.delete({ where: { id: protocolId } });
  redirect("/dashboard/protocols");
}
