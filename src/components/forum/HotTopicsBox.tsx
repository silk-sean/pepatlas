import Link from "next/link";
import { db } from "@/lib/db";

function relativeTime(d: Date): string {
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.round(days / 30);
  return `${months}mo ago`;
}

interface ThreadRow {
  id: string;
  title: string;
  replyCount: number;
  createdAt: Date;
  lastReplyAt: Date | null;
  views: number;
  category: { slug: string; name: string };
  author: { username: string | null };
}

function ThreadLine({ t }: { t: ThreadRow }) {
  const when = t.lastReplyAt ?? t.createdAt;
  return (
    <Link
      href={`/forum/${t.category.slug}/${t.id}`}
      className="group block py-2.5 px-1 border-b border-[#1a1a1a] last:border-0 hover:bg-[rgba(255,45,120,0.03)] transition-colors -mx-1 px-3 rounded"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#FF2D78] transition-colors">
            {t.title}
          </div>
          <div className="text-[11px] text-[#9E9EAF] mt-1 flex items-center gap-1.5 flex-wrap">
            <span className="text-[#FF2D78]/80">{t.category.name}</span>
            <span>·</span>
            <span>@{t.author.username ?? "—"}</span>
            <span>·</span>
            <span>{relativeTime(when)}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-sm font-bold text-white">{t.replyCount}</div>
          <div className="text-[10px] text-[#666] uppercase tracking-wider">
            {t.replyCount === 1 ? "reply" : "replies"}
          </div>
        </div>
      </div>
    </Link>
  );
}

export async function HotTopicsBox() {
  // Hot: active in the last 14 days, ordered by most replies + most recent activity.
  // Prioritizes threads people are talking about NOW, not all-time leaderboard.
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const [hot, newest] = await Promise.all([
    db.thread.findMany({
      where: {
        OR: [
          { lastReplyAt: { gte: fourteenDaysAgo } },
          { createdAt: { gte: fourteenDaysAgo } },
        ],
      },
      orderBy: [{ replyCount: "desc" }, { lastReplyAt: "desc" }],
      take: 8,
      select: {
        id: true,
        title: true,
        replyCount: true,
        createdAt: true,
        lastReplyAt: true,
        views: true,
        category: { select: { slug: true, name: true } },
        author: { select: { username: true } },
      },
    }),
    db.thread.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        title: true,
        replyCount: true,
        createdAt: true,
        lastReplyAt: true,
        views: true,
        category: { select: { slug: true, name: true } },
        author: { select: { username: true } },
      },
    }),
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-16">
      {/* Hot Topics */}
      <div className="pa-card overflow-hidden">
        <div className="pa-forum-header flex justify-between items-center">
          <span className="flex items-center gap-2">
            <span className="text-[#FF2D78]">🔥</span> Hot Topics
          </span>
          <span className="text-xs opacity-60 font-medium">Last 14 days</span>
        </div>
        <div className="px-4 py-2">
          {hot.length === 0 ? (
            <p className="text-sm text-[#9E9EAF] py-4 text-center">
              No recent activity.
            </p>
          ) : (
            hot.map((t) => <ThreadLine key={t.id} t={t} />)
          )}
        </div>
        <div
          className="p-3 text-center border-t border-[#1a1a1a]"
          style={{ background: "#0A0A0F" }}
        >
          <Link
            href="/forum"
            className="text-[#FF2D78] font-semibold text-sm hover:underline"
          >
            Browse all forums →
          </Link>
        </div>
      </div>

      {/* Newest */}
      <div className="pa-card overflow-hidden">
        <div className="pa-forum-header flex justify-between items-center">
          <span className="flex items-center gap-2">
            <span className="text-[#7B2FFF]">✦</span> Newest Threads
          </span>
          <span className="text-xs opacity-60 font-medium">Freshly posted</span>
        </div>
        <div className="px-4 py-2">
          {newest.length === 0 ? (
            <p className="text-sm text-[#9E9EAF] py-4 text-center">
              No threads yet.
            </p>
          ) : (
            newest.map((t) => <ThreadLine key={t.id} t={t} />)
          )}
        </div>
        <div
          className="p-3 text-center border-t border-[#1a1a1a]"
          style={{ background: "#0A0A0F" }}
        >
          <Link
            href="/forum/new"
            className="text-[#7B2FFF] font-semibold text-sm hover:underline"
          >
            Start a thread →
          </Link>
        </div>
      </div>
    </div>
  );
}
