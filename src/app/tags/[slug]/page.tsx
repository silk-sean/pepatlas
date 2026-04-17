import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await db.tag.findUnique({ where: { slug } });
  if (!tag) return {};
  return {
    title: `#${tag.name} — PepAtlas`,
    description: `Forum threads tagged #${tag.name}.`,
  };
}

function relativeTime(d: Date | null): string {
  if (!d) return "";
  const diff = Date.now() - d.getTime();
  const hrs = Math.round(diff / 3_600_000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return `${Math.round(days / 30)}mo ago`;
}

export default async function TagDetailPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await db.tag.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      threads: {
        orderBy: { lastReplyAt: "desc" },
        take: 100,
        select: {
          id: true,
          title: true,
          body: true,
          replyCount: true,
          createdAt: true,
          lastReplyAt: true,
          views: true,
          author: { select: { username: true } },
          category: { select: { slug: true, name: true } },
        },
      },
    },
  });
  if (!tag) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="text-sm text-[#9E9EAF] mb-3">
        <Link href="/tags" className="hover:text-white transition-colors">
          Tags
        </Link>
        {" / "}
        <span className="text-white">#{tag.name}</span>
      </nav>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
        <span className="text-[#FF2D78]">#</span>
        {tag.name}
      </h1>
      <p className="text-sm text-[#9E9EAF] mb-6">
        {tag.threads.length} thread{tag.threads.length === 1 ? "" : "s"}
      </p>

      {tag.threads.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-[#9E9EAF]">
            No threads with this tag.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tag.threads.map((t) => (
            <Link
              key={t.id}
              href={`/forum/${t.category.slug}/${t.id}`}
              className="group block rounded-xl border border-[#333] bg-[#111] p-4 hover:border-[#FF2D78]/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-[#9E9EAF] mb-1">
                    <span className="text-[#FF2D78]/80">{t.category.name}</span>
                    {t.author.username && (
                      <>
                        {" · "}@{t.author.username}
                      </>
                    )}
                    {" · "}
                    {relativeTime(t.lastReplyAt ?? t.createdAt)}
                  </div>
                  <div className="text-base font-semibold text-white group-hover:text-[#FF2D78] transition-colors">
                    {t.title}
                  </div>
                  <p className="text-sm text-[#9E9EAF] mt-1 line-clamp-2">
                    {t.body.slice(0, 160)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-lg font-bold text-white">
                    {t.replyCount}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#666]">
                    {t.replyCount === 1 ? "reply" : "replies"}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
