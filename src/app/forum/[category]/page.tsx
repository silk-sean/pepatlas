import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { FORUM_CATEGORIES, SITE_URL } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplierBadge } from "@/components/shared/SupplierBadge";
import { ThreadRow } from "@/components/forum/ThreadRow";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = FORUM_CATEGORIES.find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: `${cat.name} — Forum`,
    description: cat.description,
    openGraph: {
      title: `${cat.name} — PepAtlas Forum`,
      url: `${SITE_URL}/forum/${category}`,
    },
  };
}

export default async function ForumCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = FORUM_CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const categoryRow = await db.forumCategory.findUnique({ where: { slug: category } });
  if (!categoryRow) notFound();

  const threads = await db.thread.findMany({
    where: { categoryId: categoryRow.id },
    // Pinned first, then by last reply (or created if no replies)
    orderBy: [{ isPinned: "desc" }, { lastReplyAt: "desc" }],
    take: 50,
    include: {
      author: { select: { username: true, name: true, postCount: true } },
      lastReplyAuthor: { select: { username: true, name: true } },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-10">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <nav className="text-sm text-gray-500 mb-2">
                <Link href="/forum" className="hover:text-gray-300">Forums</Link>
                {" / "}
                <span className="text-gray-300">{cat.name}</span>
              </nav>
              <h1 className="text-3xl font-bold text-white">{cat.name}</h1>
              <p className="mt-1 text-gray-400">{cat.description}</p>
            </div>
            <Link
              href={`/forum/new?category=${category}`}
              className="inline-flex items-center rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 transition-colors"
            >
              New Thread
            </Link>
          </div>

          {threads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-400">No threads in this category yet.</p>
                <p className="text-sm text-gray-500 mt-2">Be the first to start a discussion!</p>
                <Link
                  href={`/forum/new?category=${category}`}
                  className="mt-4 inline-flex items-center rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 transition-colors"
                >
                  Create Thread
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="border border-gray-800 rounded-lg overflow-hidden bg-[#1a1a22]">
              {threads.map((t) => (
                <ThreadRow
                  key={t.id}
                  id={t.id}
                  title={t.title}
                  body={t.body}
                  categorySlug={category}
                  author={t.author}
                  views={t.views}
                  replyCount={t.replyCount}
                  isPinned={t.isPinned}
                  isLocked={t.isLocked}
                  createdAt={t.createdAt}
                  lastReplyAt={t.lastReplyAt}
                  lastReplyAuthor={t.lastReplyAuthor}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          <SupplierBadge />
          <Card>
            <CardHeader><CardTitle className="text-sm">Other Categories</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {FORUM_CATEGORIES.filter((c) => c.slug !== category).map((c) => (
                <Link
                  key={c.slug}
                  href={`/forum/${c.slug}`}
                  className="block text-sm text-gray-400 hover:text-gray-200"
                >
                  {c.name}
                </Link>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
