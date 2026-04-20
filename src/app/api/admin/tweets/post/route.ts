import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { postTweet, verifyCredentials } from "@/lib/twitter";

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
    text?: string;
    verifyOnly?: boolean;
  } | null;

  // Debug path: verify creds without posting anything
  if (body?.verifyOnly) {
    const result = await verifyCredentials();
    return NextResponse.json(result);
  }

  const text = (body?.text ?? "").trim();
  if (!text) {
    return NextResponse.json({ error: "Empty tweet" }, { status: 400 });
  }
  if (text.length > 280) {
    return NextResponse.json(
      { error: "Tweet exceeds 280 characters" },
      { status: 400 }
    );
  }

  const result = await postTweet(text);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error || "Failed to post" },
      { status: 500 }
    );
  }
  return NextResponse.json(result);
}
