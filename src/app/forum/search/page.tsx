import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { ForumSearchBar } from "@/components/forum/ForumSearchBar";
import { PartnerSidebar } from "@/components/shared/PartnerSidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search — Forum",
  robots: { index: false, follow: true },
};

interface ThreadHit {
  id: string;
  title: string;
  slug: string;
  body: string;
  createdAt: string;
  replyCount: number;
  categorySlug: string;
  categoryName: string;
  authorUsername: string | null;
  rank: number;
}
interface ReplyHit {
  id: string;
  body: string;
  createdAt: string;
  threadId: string;
  threadTitle: string;
  threadSlug: string;
  categorySlug: string;
  categoryName: string;
  authorUsername: string | null;
  rank: number;
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

function snippet(text: string, q: string, max = 220): string {
  if (!text) return "";
  const lower = text.toLowerCase();
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  let idx = -1;
  for (const w of words) {
    const i = lower.indexOf(w);
    if (i !== -1 && (idx === -1 || i < idx)) idx = i;
  }
  if (idx === -1) return text.slice(0, max).trim() + (text.length > max ? "…" : "");
  const start = Math.max(0, idx - 60);
  const end = Math.min(text.length, start + max);
  const pre = start > 0 ? "…" : "";
  const post = end < text.length ? "…" : "";
  return pre + text.slice(start, end).trim() + post;
}

function Highlight({ text, q }: { text: string; q: string }) {
  const words = q.split(/\s+/).filter((w) => w.length >= 2);
  if (words.length === 0) return <>{text}</>;
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i) =>
        re.test(p) ? (
          <mark key={i} className="bg-[#FF2D78]/20 text-white rounded px-0.5">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  let threads: ThreadHit[] = [];
  let replies: ReplyHit[] = [];

  if (query.length >= 2) {
    const res = await fetch(`${SITE_URL}/api/forum/search?q=${encodeURIComponent(query)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      threads = data.threads || [];
      replies = data.replies || [];
    }
  }

  const total = threads.length + replies.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-10">
        <div className="min-w-0 flex-1">
          <header className="mb-6">
            <nav className="text-sm text-[#9E9EAF] mb-3">
              <Link href="/forum" className="hover:text-white transition-colors">
                Forum
              </Link>
              {" / Search"}
            </nav>
            <h1 className="text-3xl font-bold text-white tracking-tight">Search</h1>
          </header>

          <div className="mb-6">
            <ForumSearchBar initialQuery={query} />
          </div>

          {query.length < 2 ? (
            <p className="text-[#9E9EAF]">Enter at least 2 characters to search.</p>
          ) : total === 0 ? (
            <p className="text-[#9E9EAF]">
              No results for <span className="text-white font-medium">&ldquo;{query}&rdquo;</span>.
            </p>
          ) : (
            <>
              <p className="text-sm text-[#9E9EAF] mb-4">
                {total} result{total === 1 ? "" : "s"} for{" "}
                <span className="text-white font-medium">&ldquo;{query}&rdquo;</span>
              </p>

              {threads.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-[#FF2D78] mb-3">
                    Threads ({threads.length})
                  </h2>
                  <div className="space-y-3">
                    {threads.map((t) => (
                      <Link
                        key={t.id}
                        href={`/forum/${t.categorySlug}/${t.id}`}
                        className="block"
                      >
                        <Card className="hover:border-[#FF2D78]/50 transition-colors">
                          <CardContent className="py-4">
                            <div className="text-xs text-[#9E9EAF] mb-1">
                              {t.categoryName}
                              {t.authorUsername && (
                                <>
                                  {" · "}
                                  <span className="text-[#C5C5D4]">
                                    @{t.authorUsername}
                                  </span>
                                </>
                              )}
                              {" · "}
                              {t.replyCount}{" "}
                              {t.replyCount === 1 ? "reply" : "replies"}
                            </div>
                            <h3 className="text-base font-semibold text-white leading-snug mb-1">
                              <Highlight text={t.title} q={query} />
                            </h3>
                            <p className="text-sm text-[#C5C5D4]">
                              <Highlight text={snippet(t.body, query)} q={query} />
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {replies.length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-[#7B2FFF] mb-3">
                    Replies ({replies.length})
                  </h2>
                  <div className="space-y-3">
                    {replies.map((r) => (
                      <Link
                        key={r.id}
                        href={`/forum/${r.categorySlug}/${r.threadId}#reply-${r.id}`}
                        className="block"
                      >
                        <Card className="hover:border-[#7B2FFF]/50 transition-colors">
                          <CardContent className="py-4">
                            <div className="text-xs text-[#9E9EAF] mb-1">
                              Reply in{" "}
                              <span className="text-white">{r.threadTitle}</span>
                              {" · "}
                              {r.categoryName}
                              {r.authorUsername && (
                                <>
                                  {" · "}@{r.authorUsername}
                                </>
                              )}
                            </div>
                            <p className="text-sm text-[#C5C5D4]">
                              <Highlight text={snippet(r.body, query)} q={query} />
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          <PartnerSidebar utm="forum-search" />
        </aside>
      </div>
    </div>
  );
}
