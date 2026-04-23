import { NextResponse } from "next/server";
import slugify from "slugify";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { queueGhostReplies, userIsGhost } from "@/lib/ghost-engagement";

// POST /api/forum/threads — create a new thread
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const title = String(body.title || "").trim();
  const bodyText = String(body.body || "").trim();
  const categorySlug = String(body.category || "").trim();
  // Tags: accept array of strings OR comma-separated string; normalize, dedupe, cap at 5.
  const rawTags: unknown = body.tags;
  const tagNames = Array.from(
    new Set(
      (Array.isArray(rawTags)
        ? rawTags
        : String(rawTags ?? "").split(",")
      )
        .map((t) => String(t).trim().toLowerCase())
        .filter((t) => t.length >= 2 && t.length <= 24)
    )
  ).slice(0, 5);

  if (title.length < 3 || title.length > 200) {
    return NextResponse.json(
      { error: "Title must be 3-200 characters" },
      { status: 400 },
    );
  }
  if (bodyText.length < 10 || bodyText.length > 50000) {
    return NextResponse.json(
      { error: "Body must be 10-50,000 characters" },
      { status: 400 },
    );
  }
  if (!categorySlug) {
    return NextResponse.json({ error: "Category required" }, { status: 400 });
  }

  const category = await db.forumCategory.findUnique({
    where: { slug: categorySlug },
  });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  // Build unique slug within the category
  const baseSlug = slugify(title, { lower: true, strict: true }).slice(0, 80) || "thread";
  let slug = baseSlug;
  let n = 1;
  while (
    await db.thread.findUnique({
      where: { categoryId_slug: { categoryId: category.id, slug } },
    })
  ) {
    n += 1;
    slug = `${baseSlug}-${n}`;
    if (n > 20) break;
  }

  // Upsert tags first (outside transaction — cheap, and makes connect trivial)
  const tagConnections: { id: string }[] = [];
  for (const name of tagNames) {
    const slug = name.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!slug) continue;
    const tag = await db.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
      select: { id: true },
    });
    tagConnections.push({ id: tag.id });
  }

  // Create thread + bump user's post count in a single transaction
  const [thread] = await db.$transaction([
    db.thread.create({
      data: {
        title,
        slug,
        body: bodyText,
        authorId: session.user.id,
        categoryId: category.id,
        lastReplyAt: new Date(),
        lastReplyAuthorId: session.user.id,
        ...(tagConnections.length
          ? { tags: { connect: tagConnections } }
          : {}),
      },
      select: { id: true, slug: true },
    }),
    db.user.update({
      where: { id: session.user.id },
      data: { postCount: { increment: 1 } },
    }),
  ]);

  // Fire-and-forget: if a real user posted, queue ghost replies to simulate
  // organic engagement. Ghost users don't trigger this (prevents self-chains).
  userIsGhost(session.user.id).then((ghost) => {
    if (!ghost) {
      queueGhostReplies({
        kind: "REPLY_TO_THREAD",
        threadId: thread.id,
      }).catch((e) => console.error("[ghost-engagement] queue failed:", e));
    }
  });

  return NextResponse.json({ ok: true, thread, category: category.slug });
}
