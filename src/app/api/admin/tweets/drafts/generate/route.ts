import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateDrafts } from "@/lib/tweet-drafter";

export async function POST(req: NextRequest) {
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

  const body = (await req.json().catch(() => null)) as {
    direction?: string;
    count?: number;
  } | null;
  const direction = body?.direction?.trim().slice(0, 500);
  const count = Math.min(Math.max(body?.count ?? 6, 1), 10);

  try {
    const drafts = await generateDrafts(count, direction);
    return NextResponse.json({
      ok: true,
      count: drafts.length,
      usedAI: Boolean(process.env.ANTHROPIC_API_KEY),
      drafts: drafts.map((d) => ({
        id: d.id,
        body: d.body,
        sourceType: d.sourceType,
      })),
    });
  } catch (e) {
    console.error("[tweets/drafts/generate]", e);
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
