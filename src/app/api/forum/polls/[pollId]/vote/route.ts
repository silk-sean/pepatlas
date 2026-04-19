import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// POST /api/forum/polls/[pollId]/vote — cast vote(s). Upserts by (userId, optionId).
// body: { optionIds: string[] } (single item for single-choice; multiple for multi)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pollId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to vote" }, { status: 401 });
  }

  const { pollId } = await params;
  const body = (await req.json().catch(() => null)) as {
    optionIds?: string[];
  } | null;
  const optionIds = Array.from(new Set(body?.optionIds ?? [])).slice(0, 10);
  if (optionIds.length === 0) {
    return NextResponse.json({ error: "No options selected" }, { status: 400 });
  }

  const poll = await db.poll.findUnique({
    where: { id: pollId },
    include: { options: { select: { id: true } } },
  });
  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }
  if (poll.closesAt && poll.closesAt < new Date()) {
    return NextResponse.json({ error: "Poll is closed" }, { status: 403 });
  }

  // Validate that every optionId belongs to this poll
  const validIds = new Set(poll.options.map((o) => o.id));
  for (const id of optionIds) {
    if (!validIds.has(id)) {
      return NextResponse.json({ error: "Invalid option" }, { status: 400 });
    }
  }
  if (!poll.multipleChoice && optionIds.length !== 1) {
    return NextResponse.json(
      { error: "This poll allows only one choice" },
      { status: 400 }
    );
  }

  const userId = session.user.id;
  // Replace previous votes for this user in this poll with the new set
  await db.$transaction([
    db.pollVote.deleteMany({
      where: { pollId, userId },
    }),
    db.pollVote.createMany({
      data: optionIds.map((optionId) => ({
        pollId,
        optionId,
        userId,
      })),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
