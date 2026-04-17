import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tags — PepAtlas",
  description: "Browse forum threads by tag.",
};

export default async function TagsIndexPage() {
  const tags = await db.tag.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { threads: true } },
    },
    orderBy: { name: "asc" },
  });

  const withThreads = tags
    .filter((t) => t._count.threads > 0)
    .sort((a, b) => b._count.threads - a._count.threads);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-white tracking-tight">Tags</h1>
        <p className="mt-2 text-[#9E9EAF]">
          {withThreads.length} tag{withThreads.length === 1 ? "" : "s"} in use
        </p>
      </header>

      {withThreads.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-[#9E9EAF]">
            No tags yet. Add tags when starting a new thread.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-wrap gap-2">
          {withThreads.map((t) => {
            const sizeClass =
              t._count.threads >= 10
                ? "text-lg"
                : t._count.threads >= 4
                  ? "text-base"
                  : "text-sm";
            return (
              <Link
                key={t.id}
                href={`/tags/${t.slug}`}
                className={`${sizeClass} inline-flex items-center gap-1.5 rounded-full border border-[#333] bg-[#111] px-4 py-1.5 text-[#C5C5D4] hover:border-[#FF2D78] hover:text-[#FF2D78] transition-colors`}
              >
                <span>#{t.name}</span>
                <span className="text-xs text-[#666]">
                  {t._count.threads}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
