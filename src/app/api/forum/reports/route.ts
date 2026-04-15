import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to report" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    threadId?: string;
    replyId?: string;
    reason?: string;
  } | null;

  const reason = body?.reason?.trim() ?? "";
  const threadId = body?.threadId?.trim();
  const replyId = body?.replyId?.trim();

  if (!threadId && !replyId) {
    return NextResponse.json(
      { error: "Must report a thread or reply" },
      { status: 400 }
    );
  }
  if (threadId && replyId) {
    return NextResponse.json(
      { error: "Report only one at a time" },
      { status: 400 }
    );
  }
  if (reason.length < 3 || reason.length > 500) {
    return NextResponse.json(
      { error: "Reason must be 3–500 characters" },
      { status: 400 }
    );
  }

  // Dedupe: if same user already filed an OPEN report on same target, reject.
  const existing = await db.report.findFirst({
    where: {
      reporterId: session.user.id,
      threadId: threadId ?? null,
      replyId: replyId ?? null,
      status: "OPEN",
    },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "You already reported this (pending review)" },
      { status: 409 }
    );
  }

  const report = await db.report.create({
    data: {
      reporterId: session.user.id,
      reason,
      threadId: threadId ?? null,
      replyId: replyId ?? null,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: report.id });
}
