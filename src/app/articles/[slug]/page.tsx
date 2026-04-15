import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  getArticleBySlug,
  getRelatedArticles,
  CATEGORY_META,
} from "@/lib/articles";
import {
  SITE_URL,
  PEPPERPEDIA_NAME,
  pepperpediaUrl,
} from "@/lib/constants";
import { PartnerSidebar } from "@/components/shared/PartnerSidebar";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.summary,
    alternates: { canonical: `${SITE_URL}/articles/${slug}` },
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.summary,
      url: `${SITE_URL}/articles/${slug}`,
      type: "article",
    },
  };
}

const ACCENT_MAP: Record<string, string> = {
  pink: "#FF2D78",
  purple: "#7B2FFF",
  lime: "#d6ff00",
};

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const { frontmatter, content, readingTime } = article;
  const related = getRelatedArticles(article, 4);
  const catMeta = CATEGORY_META[frontmatter.category];
  const accent = frontmatter.heroAccent
    ? ACCENT_MAP[frontmatter.heroAccent]
    : catMeta.accent;

  const pubDate = new Date(frontmatter.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#9E9EAF] mb-4">
        <Link href="/articles" className="hover:text-white transition-colors">
          Articles
        </Link>
        {" / "}
        <Link
          href={`/articles?category=${frontmatter.category}`}
          className="hover:text-white transition-colors"
        >
          {catMeta.label}
        </Link>
      </nav>

      <div className="flex gap-10">
        <article className="min-w-0 flex-1">
          {/* Hero */}
          <header className="mb-8 pb-8 border-b border-[rgba(255,255,255,0.08)]">
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: accent }}
            >
              {catMeta.label}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
              {frontmatter.title}
            </h1>
            <p className="mt-4 text-lg text-[#C5C5D4] leading-relaxed">
              {frontmatter.summary}
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-[#9E9EAF]">
              {frontmatter.author && (
                <span className="font-medium text-white">{frontmatter.author}</span>
              )}
              <span>{pubDate}</span>
              <span>·</span>
              <span>{readingTime}</span>
            </div>
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {frontmatter.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[#1a1a1a] border border-[#333] px-3 py-1 text-xs text-[#C5C5D4]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Body */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-a:text-[#FF2D78] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-[#d6ff00] prose-code:bg-[#1a1a1a] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#0A0A0A] prose-pre:border prose-pre:border-[#333] prose-blockquote:border-l-[#FF2D78] prose-blockquote:text-[#C5C5D4] prose-li:text-[#C5C5D4] prose-p:text-[#C5C5D4] prose-table:text-[#C5C5D4] prose-th:text-white prose-th:border-[#333] prose-td:border-[#333]">
            <MDXRemote
              source={content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>

          {/* CTA: Discuss on Forum + Learn on Pepperpedia */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <Link
              href={
                frontmatter.forumCategory
                  ? `/forum/${frontmatter.forumCategory}`
                  : "/forum"
              }
              className="group block rounded-2xl border border-[#333] bg-[#1a1a1a] p-6 hover:border-[#FF2D78]/50 transition-all"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-[#FF2D78] mb-2">
                Community
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Discuss on the forum
              </h3>
              <p className="text-sm text-[#9E9EAF]">
                See what others are saying, share your experience, or ask a
                question.
              </p>
            </Link>
            {frontmatter.pepperpediaSlug ? (
              <a
                href={pepperpediaUrl(`/wiki/${frontmatter.pepperpediaSlug}`, "article-cta")}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-[#333] bg-[#1a1a1a] p-6 hover:border-[#7B2FFF]/50 transition-all"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-[#7B2FFF] mb-2">
                  Encyclopedia
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Research on {PEPPERPEDIA_NAME}
                </h3>
                <p className="text-sm text-[#9E9EAF]">
                  Technical reference — mechanisms, half-life, studies.
                </p>
              </a>
            ) : (
              <a
                href={pepperpediaUrl("", "article-cta")}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-[#333] bg-[#1a1a1a] p-6 hover:border-[#7B2FFF]/50 transition-all"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-[#7B2FFF] mb-2">
                  Encyclopedia
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Browse {PEPPERPEDIA_NAME}
                </h3>
                <p className="text-sm text-[#9E9EAF]">
                  The full peptide reference — compounds, mechanisms, studies.
                </p>
              </a>
            )}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.08)]">
              <h2 className="text-xl font-bold text-white mb-4">
                Related articles
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((r) => {
                  const rMeta = CATEGORY_META[r.frontmatter.category];
                  return (
                    <Link
                      key={r.frontmatter.slug}
                      href={`/articles/${r.frontmatter.slug}`}
                      className="group block rounded-2xl border border-[#333] bg-[#1a1a1a] p-5 hover:border-[#FF2D78]/50 transition-all"
                    >
                      <div
                        className="text-xs font-semibold uppercase tracking-wider mb-2"
                        style={{ color: rMeta.accent }}
                      >
                        {rMeta.label}
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug mb-2">
                        {r.frontmatter.title}
                      </h3>
                      <p className="text-sm text-[#9E9EAF] line-clamp-2">
                        {r.frontmatter.summary}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Disclaimer */}
          <p className="mt-10 text-xs text-[#666] leading-relaxed">
            Educational content only — not medical advice. Always consult a
            qualified healthcare professional before making health decisions.
          </p>
        </article>

        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          <PartnerSidebar utm="article-sidebar" />
        </aside>
      </div>
    </div>
  );
}
