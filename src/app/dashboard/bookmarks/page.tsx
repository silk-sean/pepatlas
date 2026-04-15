import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bookmarks — Dashboard",
};

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/bookmarks");

  const bookmarks = await db.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      type: true,
      targetId: true,
      createdAt: true,
    },
  });

  // Resolve thread bookmarks to real threads for display
  const threadIds = bookmarks
    .filter((b) => b.type === "thread")
    .map((b) => b.targetId);
  const threads =
    threadIds.length > 0
      ? await db.thread.findMany({
          where: { id: { in: threadIds } },
          select: {
            id: true,
            title: true,
            createdAt: true,
            replyCount: true,
            category: { select: { slug: true, name: true } },
            author: { select: { username: true } },
          },
        })
      : [];
  const threadById = new Map(threads.map((t) => [t.id, t]));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <nav className="text-sm text-[#9E9EAF] mb-3">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          {" / Bookmarks"}
        </nav>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Bookmarks
        </h1>
        <p className="mt-2 text-[#9E9EAF]">
          Threads and content you&apos;ve saved for later.
        </p>
      </header>

      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-[#9E9EAF]">
            No bookmarks yet. Click the bookmark icon on any thread to save it
            here.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => {
            if (b.type === "thread") {
              const t = threadById.get(b.targetId);
              if (!t) {
                return (
                  <Card key={b.id}>
                    <CardContent className="py-4 flex items-center justify-between gap-3">
                      <span className="text-sm text-[#9E9EAF]">
                        Deleted thread
                      </span>
                      <form
                        action={`/api/user/bookmarks/remove`}
                        method="POST"
                      >
                        <input type="hidden" name="type" value={b.type} />
                        <input type="hidden" name="targetId" value={b.targetId} />
                        <button
                          type="submit"
                          className="text-xs text-[#666] hover:text-[#FF2D78] transition-colors"
                        >
                          Remove
                        </button>
                      </form>
                    </CardContent>
                  </Card>
                );
              }
              return (
                <Card key={b.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-[#9E9EAF] mb-1">
                          {t.category.name}
                          {t.author.username && (
                            <>
                              {" · "}@{t.author.username}
                            </>
                          )}
                          {" · "}
                          {t.replyCount}{" "}
                          {t.replyCount === 1 ? "reply" : "replies"}
                        </div>
                        <Link
                          href={`/forum/${t.category.slug}/${t.id}`}
                          className="text-base font-semibold text-white hover:text-[#FF2D78] transition-colors"
                        >
                          {t.title}
                        </Link>
                      </div>
                      <form
                        action={`/api/user/bookmarks/remove`}
                        method="POST"
                        className="shrink-0"
                      >
                        <input type="hidden" name="type" value="thread" />
                        <input type="hidden" name="targetId" value={t.id} />
                        <button
                          type="submit"
                          className="text-xs text-[#666] hover:text-[#FF2D78] transition-colors"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
