import Link from "next/link";
import type { Metadata } from "next";
import { PartnerSidebar } from "@/components/shared/PartnerSidebar";
import {
  getAllArticles,
  CATEGORY_META,
  type ArticleCategory,
} from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles — Peptide Research & Education",
  description:
    "Deep-dives on peptide compounds, protocols, stacks, dosing frameworks, and recovery strategies.",
};

interface ArticlesPageProps {
  searchParams: Promise<{ category?: string; tag?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { category, tag } = await searchParams;
  const all = getAllArticles();

  const filtered = all.filter((a) => {
    if (category && a.frontmatter.category !== category) return false;
    if (tag && !(a.frontmatter.tags ?? []).includes(tag)) return false;
    return true;
  });

  // Sort newest first
  filtered.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
  );

  const featured = filtered.find((a) => a.frontmatter.featured) ?? filtered[0];
  const rest = featured
    ? filtered.filter((a) => a.frontmatter.slug !== featured.frontmatter.slug)
    : filtered;

  const categories: ArticleCategory[] = [
    "compounds",
    "protocols",
    "methods",
    "beginner",
    "science",
    "safety",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-10">
        <div className="min-w-0 flex-1">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white tracking-tight">Articles</h1>
            <p className="mt-2 text-lg text-[#9E9EAF]">
              Deep-dives on peptides, stacks, and the science behind them.
            </p>
          </header>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/articles"
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                !category
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-[#C5C5D4] border-[#333] hover:border-[#555]"
              }`}
            >
              All ({all.length})
            </Link>
            {categories.map((c) => {
              const count = all.filter((a) => a.frontmatter.category === c).length;
              if (count === 0) return null;
              const meta = CATEGORY_META[c];
              const active = category === c;
              return (
                <Link
                  key={c}
                  href={`/articles?category=${c}`}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    active
                      ? "text-black border-transparent"
                      : "bg-transparent text-[#C5C5D4] border-[#333] hover:border-[#555]"
                  }`}
                  style={active ? { backgroundColor: meta.accent } : undefined}
                >
                  {meta.label} ({count})
                </Link>
              );
            })}
          </div>

          {tag && (
            <div className="mb-6 text-sm text-[#9E9EAF]">
              Filtered by tag: <span className="text-white font-medium">#{tag}</span>
              {" · "}
              <Link href="/articles" className="text-[#FF2D78] hover:underline">
                clear
              </Link>
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="text-[#9E9EAF]">No articles yet in this section.</p>
          ) : (
            <>
              {/* Featured hero card */}
              {featured && !category && !tag && (
                <Link
                  href={`/articles/${featured.frontmatter.slug}`}
                  className="group block mb-6 rounded-2xl border border-[#333] bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-8 hover:border-[#FF2D78]/50 transition-all"
                >
                  <div
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: CATEGORY_META[featured.frontmatter.category].accent }}
                  >
                    Featured · {CATEGORY_META[featured.frontmatter.category].label}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3 group-hover:text-[#FF2D78] transition-colors">
                    {featured.frontmatter.title}
                  </h2>
                  <p className="text-[#C5C5D4] leading-relaxed max-w-3xl">
                    {featured.frontmatter.summary}
                  </p>
                  <div className="mt-4 text-xs text-[#9E9EAF]">
                    {featured.readingTime}
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {(featured && !category && !tag ? rest : filtered).map((a) => {
                  const meta = CATEGORY_META[a.frontmatter.category];
                  return (
                    <Link
                      key={a.frontmatter.slug}
                      href={`/articles/${a.frontmatter.slug}`}
                      className="group block rounded-2xl border border-[#333] bg-[#1a1a1a] p-5 hover:border-[#FF2D78]/50 transition-all"
                    >
                      <div
                        className="text-xs font-semibold uppercase tracking-wider mb-2"
                        style={{ color: meta.accent }}
                      >
                        {meta.label}
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug mb-2 group-hover:text-[#FF2D78] transition-colors">
                        {a.frontmatter.title}
                      </h3>
                      <p className="text-sm text-[#9E9EAF] line-clamp-3">
                        {a.frontmatter.summary}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-[#666]">
                        <span>{a.readingTime}</span>
                        {a.frontmatter.tags && a.frontmatter.tags.length > 0 && (
                          <span>
                            {a.frontmatter.tags
                              .slice(0, 2)
                              .map((t) => `#${t}`)
                              .join(" ")}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          <PartnerSidebar utm="articles-sidebar" />
        </aside>
      </div>
    </div>
  );
}
