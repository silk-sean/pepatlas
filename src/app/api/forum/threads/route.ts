import { NextResponse } from "next/server";
import slugify from "slugify";
import { auth } from "@/auth";
import { db } from "@/lib/db";

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
      },
      select: { id: true, slug: true },
    }),
    db.user.update({
      where: { id: session.user.id },
      data: { postCount: { increment: 1 } },
    }),
  ]);

  return NextResponse.json({ ok: true, thread, category: category.slug });
}
