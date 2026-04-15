import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ReplyForm } from "@/components/forum/ReplyForm";
import { Reactions } from "@/components/forum/Reactions";
import { StackSignature } from "@/components/forum/StackSignature";
import { MarkdownBody } from "@/components/forum/MarkdownBody";
import { QuoteButton } from "@/components/forum/QuoteButton";
import { SubscribeButton } from "@/components/forum/SubscribeButton";
import { buildReactionCounts } from "@/lib/reactions";
import { rankFor } from "@/lib/ranks";
import { isValidStack, type UserStack } from "@/lib/stack";

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
  const cat = await db.forumCategory.findUnique({
    where: { slug: category },
    include: { parent: { select: { slug: true, name: true } } },
  });
  if (!cat) notFound();

  const thread = await db.thread.findUnique({
    where: { id: threadId },
    include: {
      author: { select: { id: true, username: true, name: true, image: true, postCount: true, createdAt: true, stackJson: true } },
      reactions: { select: { type: true, userId: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, username: true, name: true, image: true, postCount: true, createdAt: true, stackJson: true } },
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

  let subscribed = false;
  if (viewerId) {
    const sub = await db.threadSubscription.findUnique({
      where: { userId_threadId: { userId: viewerId, threadId } },
    });
    subscribed = !!sub;
  }

  const threadReactions = buildReactionCounts(thread.reactions, viewerId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/forum" className="hover:text-gray-300">Forums</Link>
        {cat.parent && (
          <>
            {" / "}
            <Link href={`/forum/${cat.parent.slug}`} className="hover:text-gray-300">
              {cat.parent.name}
            </Link>
          </>
        )}
        {" / "}
        <Link href={`/forum/${category}`} className="hover:text-gray-300">{cat.name}</Link>
      </nav>

      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {thread.isPinned && (
              <span className="text-[10px] uppercase tracking-wider text-pink-400 font-bold">📌 Pinned</span>
            )}
            {thread.isLocked && (
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">🔒 Locked</span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">{thread.title}</h1>
        </div>
        <SubscribeButton threadId={thread.id} initialSubscribed={subscribed} isAuthed={!!viewerId} />
      </div>

      {/* OP post */}
      <Card className="mb-6">
        <CardContent className="py-5">
          <PostBody
            author={thread.author}
            body={thread.body}
            createdAt={thread.createdAt}
            views={thread.views}
          />
          <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
            <Reactions
              threadId={thread.id}
              initial={threadReactions}
              isAuthed={!!viewerId}
            />
            <div className="flex items-center gap-3">
              <QuoteButton author={thread.author.username || thread.author.name || "unknown"} body={thread.body} />
            </div>
          </div>
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
              <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
                <Reactions
                  replyId={r.id}
                  initial={buildReactionCounts(r.reactions, viewerId)}
                  isAuthed={!!viewerId}
                />
                <div className="flex items-center gap-3">
                  <QuoteButton author={r.author.username || r.author.name || "unknown"} body={r.body} />
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
            <Link href={`/login?callbackUrl=/forum/${category}/${threadId}`} className="text-pink-400 hover:text-pink-300">
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
  stackJson: unknown;
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
  const stack = isValidStack(author.stackJson) ? (author.stackJson as UserStack) : null;

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
        <MarkdownBody source={body} />
        <StackSignature stack={stack} username={display} />
      </div>
    </div>
  );
}
