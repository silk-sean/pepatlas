import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { TweetComposer } from "@/components/admin/TweetComposer";
import { DraftQueue } from "@/components/admin/DraftQueue";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tweets — Admin",
};

export default async function AdminTweetsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin/tweets");
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (me?.role !== "ADMIN") redirect("/");

  const [pending, recentlyPosted, rejected] = await Promise.all([
    db.tweetDraft.findMany({
      where: { status: { in: ["PENDING", "FAILED"] } },
      orderBy: { generatedAt: "desc" },
      take: 30,
    }),
    db.tweetDraft.findMany({
      where: { status: "POSTED" },
      orderBy: { postedAt: "desc" },
      take: 10,
    }),
    db.tweetDraft.count({ where: { status: "REJECTED" } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <nav className="text-sm text-[#9E9EAF] mb-3">
          <Link href="/admin" className="hover:text-white transition-colors">
            Admin
          </Link>
          {" / Tweets"}
        </nav>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          @pepatlas
        </h1>
        <p className="mt-2 text-[#9E9EAF]">
          Draft queue + manual composer. Drafts are generated from forum + article activity.
          Approve to post, reject to skip.
        </p>
      </header>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#FF2D78]">
            Draft Queue ({pending.length})
          </h2>
        </div>
        <DraftQueue
          drafts={pending.map((d) => ({
            id: d.id,
            body: d.body,
            sourceType: d.sourceType ?? "",
            sourceId: d.sourceId ?? "",
            generatedAt: d.generatedAt.toISOString(),
            status: d.status,
            errorMessage: d.errorMessage ?? "",
          }))}
        />
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#7B2FFF] mb-3">
          Manual Compose
        </h2>
        <TweetComposer />
      </section>

      {recentlyPosted.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#d6ff00] mb-3">
            Recently Posted ({recentlyPosted.length})
          </h2>
          <div className="space-y-2">
            {recentlyPosted.map((d) => (
              <div
                key={d.id}
                className="rounded-lg border border-[#333] bg-[#111] p-3"
              >
                <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">
                  {d.body}
                </p>
                <div className="mt-2 text-xs text-[#666] flex items-center gap-3 flex-wrap">
                  <span>
                    Posted{" "}
                    {d.postedAt ? new Date(d.postedAt).toLocaleString() : "—"}
                  </span>
                  {d.tweetUrl && (
                    <a
                      href={d.tweetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1DA1F2] hover:underline"
                    >
                      View on X ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="rounded-xl border border-[#333] bg-[#0f0f0f] p-4 text-xs text-[#666] leading-relaxed">
        <p>
          <strong className="text-[#9E9EAF]">Queue stats:</strong>{" "}
          {rejected} rejected all-time · {recentlyPosted.length} posted in last
          10.
        </p>
        <p className="mt-1">
          Tweets post immediately when approved. No scheduling yet (coming).
          Draft generator uses rule-based templates; AI-written candidates come
          later.
        </p>
      </div>
    </div>
  );
}
