import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { postTweet } from "@/lib/twitter";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  return me?.role === "ADMIN" ? session.user.id : null;
}

// POST /api/admin/tweets/drafts/[id] — { action: "approve" | "reject" | "edit", body? }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireAdmin();
  if (!userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as {
    action?: "approve" | "reject" | "edit" | "schedule";
    body?: string;
    scheduledFor?: string; // ISO datetime
  } | null;

  const action = body?.action;
  if (!action) {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
  }

  const draft = await db.tweetDraft.findUnique({ where: { id } });
  if (!draft) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  }

  if (action === "edit") {
    const newBody = (body?.body ?? "").trim();
    if (!newBody || newBody.length > 280) {
      return NextResponse.json(
        { error: "Body must be 1-280 chars" },
        { status: 400 }
      );
    }
    const updated = await db.tweetDraft.update({
      where: { id },
      data: { body: newBody },
    });
    return NextResponse.json({ ok: true, draft: updated });
  }

  if (action === "reject") {
    await db.tweetDraft.update({
      where: { id },
      data: { status: "REJECTED" },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "schedule") {
    if (draft.status !== "PENDING") {
      return NextResponse.json(
        { error: `Cannot schedule a ${draft.status} draft` },
        { status: 400 }
      );
    }
    const iso = body?.scheduledFor;
    if (!iso) {
      return NextResponse.json(
        { error: "Missing scheduledFor" },
        { status: 400 }
      );
    }
    const when = new Date(iso);
    if (isNaN(when.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    if (when.getTime() < Date.now() - 60_000) {
      return NextResponse.json(
        { error: "Schedule must be in the future" },
        { status: 400 }
      );
    }
    const updated = await db.tweetDraft.update({
      where: { id },
      data: {
        status: "APPROVED",
        scheduledFor: when,
      },
    });
    return NextResponse.json({ ok: true, draft: updated });
  }

  if (action === "approve") {
    if (draft.status !== "PENDING" && draft.status !== "APPROVED") {
      return NextResponse.json(
        { error: `Cannot approve a ${draft.status} draft` },
        { status: 400 }
      );
    }
    // Post to X immediately
    const result = await postTweet(draft.body);
    if (!result.ok) {
      await db.tweetDraft.update({
        where: { id },
        data: {
          status: "FAILED",
          errorMessage: result.error ?? "unknown",
        },
      });
      return NextResponse.json(
        { error: result.error || "Post failed" },
        { status: 500 }
      );
    }
    await db.tweetDraft.update({
      where: { id },
      data: {
        status: "POSTED",
        postedAt: new Date(),
        tweetId: result.tweetId ?? null,
        tweetUrl: result.url ?? null,
      },
    });
    return NextResponse.json({
      ok: true,
      tweetUrl: result.url,
      tweetId: result.tweetId,
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
