import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { FORUM_CATEGORIES, SITE_URL } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplierBadge } from "@/components/shared/SupplierBadge";
import { db } from "@/lib/db";

// Forum is dynamic — reads from DB on each request
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

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default async function ForumCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = FORUM_CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const categoryRow = await db.forumCategory.findUnique({
    where: { slug: category },
  });
  if (!categoryRow) notFound();

  const threads = await db.thread.findMany({
    where: { categoryId: categoryRow.id },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    take: 50,
    include: {
      author: { select: { username: true, name: true, image: true } },
      _count: { select: { replies: true } },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-10">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <nav className="text-sm text-gray-500 mb-2">
                <Link href="/forum" className="hover:text-gray-900">Forums</Link>
                {" / "}
                <span className="text-gray-900">{cat.name}</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">{cat.name}</h1>
              <p className="mt-1 text-gray-600">{cat.description}</p>
            </div>
            <Link
              href={`/forum/new?category=${category}`}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              New Thread
            </Link>
          </div>

          {threads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No threads in this category yet.</p>
                <p className="text-sm text-gray-400 mt-2">Be the first to start a discussion!</p>
                <Link
                  href={`/forum/new?category=${category}`}
                  className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Create Thread
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="divide-y divide-gray-800 border border-gray-800 rounded-lg overflow-hidden bg-[#1a1a22]">
              {threads.map((t) => (
                <Link
                  key={t.id}
                  href={`/forum/${category}/${t.id}`}
                  className="flex items-start gap-4 p-4 hover:bg-[#22222a] transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shrink-0 flex items-center justify-center text-white font-bold text-sm">
                    {(t.author.username || t.author.name || "?")[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {t.isPinned && (
                        <span className="text-[10px] uppercase tracking-wider text-pink-400 font-bold">📌 Pinned</span>
                      )}
                      {t.isLocked && (
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">🔒 Locked</span>
                      )}
                      <h3 className="font-semibold text-white truncate">{t.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{t.body.slice(0, 200)}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>by <span className="text-gray-300">{t.author.username || t.author.name}</span></span>
                      <span>•</span>
                      <span>{t._count.replies} {t._count.replies === 1 ? "reply" : "replies"}</span>
                      <span>•</span>
                      <span>{t.views} views</span>
                      <span>•</span>
                      <span>{formatRelative(t.updatedAt)}</span>
                    </div>
                  </div>
                </Link>
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
                  className="block text-sm text-gray-600 hover:text-gray-900"
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
