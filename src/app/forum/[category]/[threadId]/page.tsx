import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { FORUM_CATEGORIES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ReplyForm } from "@/components/forum/ReplyForm";
import { Reactions } from "@/components/forum/Reactions";
import { buildReactionCounts } from "@/lib/reactions";
import { rankFor } from "@/lib/ranks";

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
      author: { select: { id: true, username: true, name: true, image: true, postCount: true, createdAt: true } },
      reactions: { select: { type: true, userId: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, username: true, name: true, image: true, postCount: true, createdAt: true } },
          reactions: { select: { type: true, userId: true } },
        },
      },
    },
  });
  if (!thread) notFound();

  // Fire-and-forget view increment
  db.thread.update({ where: { id: threadId }, data: { views: { increment: 1 } } }).catch(() => {});

  const session = await auth();
  const viewerId = session?.user?.id;

  const threadReactions = buildReactionCounts(thread.reactions, viewerId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/forum" className="hover:text-gray-300">Forums</Link>
        {" / "}
        <Link href={`/forum/${category}`} className="hover:text-gray-300">{cat.name}</Link>
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
        </CardHeader>
        <CardContent>
          <PostBody
            author={thread.author}
            body={thread.body}
            createdAt={thread.createdAt}
            views={thread.views}
          />
          <Reactions
            threadId={thread.id}
            initial={threadReactions}
            isAuthed={!!viewerId}
          />
        </CardContent>
      </Card>

      <h2 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">
        {thread.replyCount} {thread.replyCount === 1 ? "Reply" : "Replies"}
      </h2>

      <div className="space-y-3 mb-8">
        {thread.replies.map((r) => (
          <Card key={r.id}>
            <CardContent className="py-4">
              <PostBody
                author={r.author}
                body={r.body}
                createdAt={r.createdAt}
                editedAt={r.editedAt}
                compact
              />
              <Reactions
                replyId={r.id}
                initial={buildReactionCounts(r.reactions, viewerId)}
                isAuthed={!!viewerId}
              />
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

interface AuthorMeta {
  id: string;
  username: string | null;
  name: string | null;
  image: string | null;
  postCount: number;
  createdAt: Date;
}

function PostBody({
  author,
  body,
  createdAt,
  editedAt,
  views,
  compact,
}: {
  author: AuthorMeta;
  body: string;
  createdAt: Date;
  editedAt?: Date | null;
  views?: number;
  compact?: boolean;
}) {
  const rank = rankFor(author.postCount);
  const joinYear = author.createdAt.getFullYear();
  const display = author.username || author.name || "unknown";
  const avatarSize = compact ? "h-10 w-10 text-xs" : "h-12 w-12 text-sm";
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="shrink-0 flex flex-col items-center">
        <Link
          href={author.username ? `/profile/${author.username}` : "#"}
          className={`${avatarSize} rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold`}
        >
          {display[0]?.toUpperCase()}
        </Link>
        <div className="text-[10px] text-gray-500 mt-1 text-center leading-tight">
          Joined {joinYear}<br />{author.postCount} posts
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap text-sm mb-0.5">
          <Link
            href={author.username ? `/profile/${author.username}` : "#"}
            className="text-gray-200 font-semibold hover:text-pink-400"
          >
            {display}
          </Link>
          <span className={`text-xs ${rank.color}`}>
            {rank.badge ? `${rank.badge} ` : ""}{rank.name}
          </span>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {formatRelative(createdAt)}
          {views !== undefined && <> · {views} views</>}
          {editedAt && <> · edited {formatRelative(editedAt)}</>}
        </div>
        <div className="whitespace-pre-wrap text-[14px] sm:text-[15px] leading-relaxed">{body}</div>
      </div>
    </div>
  );
}
