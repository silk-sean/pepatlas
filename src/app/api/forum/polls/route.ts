import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// POST /api/forum/polls — attach a poll to a thread (OP or mod only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    threadId?: string;
    question?: string;
    options?: string[];
    multipleChoice?: boolean;
    closesAt?: string | null;
  } | null;

  const threadId = body?.threadId?.trim();
  const question = (body?.question ?? "").trim();
  const optionLabels = (body?.options ?? [])
    .map((o) => String(o).trim())
    .filter((o) => o.length >= 1 && o.length <= 120)
    .slice(0, 10);
  const multipleChoice = !!body?.multipleChoice;
  const closesAt = body?.closesAt ? new Date(body.closesAt) : null;

  if (!threadId) {
    return NextResponse.json({ error: "threadId required" }, { status: 400 });
  }
  if (question.length < 3 || question.length > 240) {
    return NextResponse.json(
      { error: "Question must be 3–240 characters" },
      { status: 400 }
    );
  }
  if (optionLabels.length < 2) {
    return NextResponse.json(
      { error: "At least 2 options required" },
      { status: 400 }
    );
  }
  if (closesAt && isNaN(closesAt.getTime())) {
    return NextResponse.json({ error: "Invalid closesAt" }, { status: 400 });
  }

  const thread = await db.thread.findUnique({
    where: { id: threadId },
    select: { id: true, authorId: true, poll: { select: { id: true } } },
  });
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }
  if (thread.poll) {
    return NextResponse.json(
      { error: "Thread already has a poll" },
      { status: 409 }
    );
  }

  // Permission: thread author or a mod/admin
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  const isMod = me?.role === "MODERATOR" || me?.role === "ADMIN";
  if (thread.authorId !== session.user.id && !isMod) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const poll = await db.poll.create({
    data: {
      threadId,
      question,
      multipleChoice,
      closesAt,
      options: {
        create: optionLabels.map((label, i) => ({
          label,
          sortOrder: i,
        })),
      },
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, pollId: poll.id });
}
