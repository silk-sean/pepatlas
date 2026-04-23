import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerSidebar } from "@/components/shared/PartnerSidebar";
import { ThreadRow } from "@/components/forum/ThreadRow";
import { ForumSearchBar } from "@/components/forum/ForumSearchBar";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = await db.forumCategory.findUnique({ where: { slug: category } });
  if (!cat) return {};
  const canonical = `${SITE_URL}/forum/${category}`;
  return {
    title: `${cat.name} — Forum`,
    description: cat.description,
    alternates: { canonical },
    openGraph: {
      title: `${cat.name} — PepAtlas Forum`,
      url: canonical,
    },
  };
}

export default async function ForumCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = await db.forumCategory.findUnique({
    where: { slug: category },
    include: {
      parent: { select: { slug: true, name: true } },
      children: {
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { threads: true } } },
      },
    },
  });
  if (!cat) notFound();

  const threads = await db.thread.findMany({
    where: { categoryId: cat.id },
    orderBy: [{ isPinned: "desc" }, { lastReplyAt: "desc" }],
    take: 50,
    include: {
      author: { select: { username: true, name: true, postCount: true } },
      lastReplyAuthor: { select: { username: true, name: true } },
    },
  });

  // Peer categories (same parent) for sidebar
  const peers = await db.forumCategory.findMany({
    where: { parentId: cat.parentId ?? null, NOT: { id: cat.id } },
    orderBy: { sortOrder: "asc" },
    take: 20,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-10">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div className="min-w-0">
              <nav className="text-sm text-gray-500 mb-2">
                <Link href="/forum" className="hover:text-gray-300">Forums</Link>
                {cat.parent && (
                  <>
                    {" / "}
                    <Link
                      href={`/forum/${cat.parent.slug}`}
                      className="hover:text-gray-300"
                    >
                      {cat.parent.name}
                    </Link>
                  </>
                )}
                {" / "}
                <span className="text-gray-300">{cat.name}</span>
              </nav>
              <h1 className="text-3xl font-bold text-white">{cat.name}</h1>
              <p className="mt-1 text-gray-400">{cat.description}</p>
            </div>
            <Link
              href={`/forum/new?category=${category}`}
              className="inline-flex items-center rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 transition-colors shrink-0"
            >
              New Thread
            </Link>
          </div>
          <div className="mb-6 max-w-md">
            <ForumSearchBar />
          </div>

          {cat.children.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-2">
                Sub-forums
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {cat.children.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/forum/${sub.slug}`}
                    className="flex items-center justify-between rounded-lg p-3 bg-[#1a1a22] border border-gray-800 hover:border-pink-500/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-gray-200 truncate">{sub.name}</div>
                      <div className="text-xs text-gray-500 truncate">{sub.description}</div>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0 ml-2">
                      {sub._count.threads}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {threads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-400">
                  {cat.children.length > 0
                    ? "No threads at this level — try a sub-forum above."
                    : "No threads in this category yet."}
                </p>
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
          <PartnerSidebar utm="category-sidebar" />
          {peers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {cat.parent ? "Sibling Forums" : "Other Categories"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {peers.map((c) => (
                  <Link
                    key={c.id}
                    href={`/forum/${c.slug}`}
                    className="block text-sm text-gray-400 hover:text-gray-200"
                  >
                    {c.name}
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
