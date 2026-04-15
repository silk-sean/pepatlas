import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (me?.role !== "MODERATOR" && me?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { reportId } = await params;
  const body = (await req.json().catch(() => null)) as {
    action?: "resolve" | "dismiss";
  } | null;

  const action = body?.action;
  if (action !== "resolve" && action !== "dismiss") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await db.report.update({
    where: { id: reportId },
    data: {
      status: action === "resolve" ? "RESOLVED" : "DISMISSED",
      resolverId: session.user.id,
      resolvedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, status: updated.status });
}
