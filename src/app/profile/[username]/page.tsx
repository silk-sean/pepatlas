import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { rankFor, nextRank } from "@/lib/ranks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username} — Profile` };
}

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      bio: true,
      signature: true,
      location: true,
      postCount: true,
      createdAt: true,
      role: true,
    },
  });
  if (!user || !user.username) notFound();

  const rank = rankFor(user.postCount);
  const next = nextRank(user.postCount);

  // Recent threads + replies
  const [recentThreads, recentReplies] = await Promise.all([
    db.thread.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        createdAt: true,
        replyCount: true,
        category: { select: { slug: true, name: true } },
      },
    }),
    db.reply.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        body: true,
        createdAt: true,
        thread: {
          select: {
            id: true,
            title: true,
            category: { select: { slug: true } },
          },
        },
      },
    }),
  ]);

  const display = user.username;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shrink-0">
              {display[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">@{display}</h1>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span className={`text-sm ${rank.color} font-semibold`}>
                  {rank.badge ? `${rank.badge} ` : ""}{rank.name}
                </span>
                {user.role === "MODERATOR" && (
                  <span className="text-[10px] uppercase tracking-wider bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 px-2 py-0.5 rounded">
                    Moderator
                  </span>
                )}
                {user.role === "ADMIN" && (
                  <span className="text-[10px] uppercase tracking-wider bg-pink-500/20 border border-pink-500/50 text-pink-300 px-2 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </div>
              {user.bio && <p className="mt-3 text-sm text-gray-300">{user.bio}</p>}
              {user.location && (
                <p className="mt-1 text-xs text-gray-500">📍 {user.location}</p>
              )}
              <div className="grid grid-cols-3 gap-4 mt-4 max-w-sm">
                <Stat label="Posts" value={user.postCount} />
                <Stat label="Joined" value={formatRelative(user.createdAt)} />
                <Stat label="Rank" value={rank.name} />
              </div>
              {next && (
                <p className="mt-3 text-xs text-gray-500">
                  {next.minPosts - user.postCount} posts to <span className={next.color}>{next.name}</span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent threads */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Threads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentThreads.length === 0 ? (
              <p className="text-sm text-gray-500">No threads yet.</p>
            ) : (
              recentThreads.map((t) => (
                <Link
                  key={t.id}
                  href={`/forum/${t.category.slug}/${t.id}`}
                  className="block text-sm text-gray-300 hover:text-pink-400"
                >
                  <div className="truncate">{t.title}</div>
                  <div className="text-xs text-gray-500">
                    in {t.category.name} · {t.replyCount} {t.replyCount === 1 ? "reply" : "replies"} · {formatRelative(t.createdAt)}
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Replies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentReplies.length === 0 ? (
              <p className="text-sm text-gray-500">No replies yet.</p>
            ) : (
              recentReplies.map((r) => (
                <Link
                  key={r.id}
                  href={`/forum/${r.thread.category.slug}/${r.thread.id}`}
                  className="block text-sm hover:text-pink-400"
                >
                  <div className="truncate text-gray-400">{r.body.slice(0, 80)}...</div>
                  <div className="text-xs text-gray-500">
                    in &ldquo;{r.thread.title}&rdquo; · {formatRelative(r.createdAt)}
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-gray-500">{label}</div>
    </div>
  );
}
