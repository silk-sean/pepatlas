import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { FORUM_CATEGORIES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ReplyForm } from "@/components/forum/ReplyForm";

export const dynamic = "force-dynamic";

interface ThreadPageProps {
  params: Promise<{ category: string; threadId: string }>;
}

export async function generateMetadata({ params }: ThreadPageProps): Promise<Metadata> {
  const { threadId } = await params;
  const thread = await db.thread.findUnique({ where: { id: threadId } });
  if (!thread) return {};
  return { title: thread.title };
}

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default async function ThreadDetailPage({ params }: ThreadPageProps) {
  const { category, threadId } = await params;
  const cat = FORUM_CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const thread = await db.thread.findUnique({
    where: { id: threadId },
    include: {
      author: { select: { username: true, name: true, image: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { username: true, name: true, image: true } } },
      },
    },
  });
  if (!thread) notFound();

  // Increment views (fire and forget — don't block render)
  db.thread.update({ where: { id: threadId }, data: { views: { increment: 1 } } }).catch(() => {});

  const session = await auth();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/forum" className="hover:text-gray-900">Forums</Link>
        {" / "}
        <Link href={`/forum/${category}`} className="hover:text-gray-900">{cat.name}</Link>
      </nav>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {thread.isPinned && (
              <span className="text-[10px] uppercase tracking-wider text-pink-400 font-bold">📌 Pinned</span>
            )}
            {thread.isLocked && (
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">🔒 Locked</span>
            )}
          </div>
          <CardTitle className="text-2xl">{thread.title}</CardTitle>
          <div className="text-sm text-gray-500 flex items-center gap-3 flex-wrap mt-1">
            <span>by <span className="text-gray-300">{thread.author.username || thread.author.name}</span></span>
            <span>•</span>
            <span>{formatRelative(thread.createdAt)}</span>
            <span>•</span>
            <span>{thread.views} views</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
            {thread.body}
          </div>
        </CardContent>
      </Card>

      <h2 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">
        {thread.replies.length} {thread.replies.length === 1 ? "Reply" : "Replies"}
      </h2>

      <div className="space-y-3 mb-8">
        {thread.replies.map((r) => (
          <Card key={r.id}>
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shrink-0 flex items-center justify-center text-white font-bold text-xs">
                  {(r.author.username || r.author.name || "?")[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-gray-500 mb-1">
                    <span className="text-gray-300 font-medium">{r.author.username || r.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>{formatRelative(r.createdAt)}</span>
                  </div>
                  <div className="whitespace-pre-wrap text-[14px] leading-relaxed">
                    {r.body}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {thread.isLocked ? (
        <p className="text-sm text-gray-500 italic">This thread is locked — no new replies.</p>
      ) : session?.user ? (
        <Card>
          <CardHeader><CardTitle className="text-sm">Reply</CardTitle></CardHeader>
          <CardContent><ReplyForm threadId={thread.id} /></CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-4 text-center text-sm text-gray-500">
            <Link href={`/login?callbackUrl=/forum/${category}/${threadId}`} className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
            {" "}to reply.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
