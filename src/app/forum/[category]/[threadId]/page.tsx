import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ReplyForm } from "@/components/forum/ReplyForm";
import { SubscribeButton } from "@/components/forum/SubscribeButton";
import { PostCard } from "@/components/forum/PostCard";
import { buildReactionCounts } from "@/lib/reactions";

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
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          postCount: true,
          createdAt: true,
          stackJson: true,
        },
      },
      reactions: { select: { type: true, userId: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              postCount: true,
              createdAt: true,
              stackJson: true,
            },
          },
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

  // Fetch viewer's role once so mod buttons can be shown/hidden server-side.
  let viewerRole: "MEMBER" | "MODERATOR" | "ADMIN" | null = null;
  let subscribed = false;
  if (viewerId) {
    const me = await db.user.findUnique({
      where: { id: viewerId },
      select: { role: true },
    });
    viewerRole = me?.role ?? null;
    const sub = await db.threadSubscription.findUnique({
      where: { userId_threadId: { userId: viewerId, threadId } },
    });
    subscribed = !!sub;
  }
  const isMod = viewerRole === "MODERATOR" || viewerRole === "ADMIN";

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
        <SubscribeButton
          threadId={thread.id}
          initialSubscribed={subscribed}
          isAuthed={!!viewerId}
        />
      </div>

      <Card className="mb-6">
        <CardContent className="py-5">
          <PostCard
            kind="thread"
            id={thread.id}
            threadId={thread.id}
            categorySlug={category}
            title={thread.title}
            body={thread.body}
            createdAt={thread.createdAt.toISOString()}
            views={thread.views}
            isPinned={thread.isPinned}
            isLocked={thread.isLocked}
            author={{
              ...thread.author,
              createdAt: thread.author.createdAt.toISOString(),
            }}
            reactions={buildReactionCounts(thread.reactions, viewerId)}
            isAuthed={!!viewerId}
            canEdit={thread.author.id === viewerId || isMod}
            canDelete={thread.author.id === viewerId || isMod}
            canModerate={isMod}
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
              <PostCard
                kind="reply"
                id={r.id}
                threadId={thread.id}
                categorySlug={category}
                body={r.body}
                createdAt={r.createdAt.toISOString()}
                editedAt={r.editedAt?.toISOString() ?? null}
                author={{
                  ...r.author,
                  createdAt: r.author.createdAt.toISOString(),
                }}
                reactions={buildReactionCounts(r.reactions, viewerId)}
                isAuthed={!!viewerId}
                canEdit={r.author.id === viewerId || isMod}
                canDelete={r.author.id === viewerId || isMod}
                canModerate={isMod}
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
            <Link
              href={`/login?callbackUrl=/forum/${category}/${threadId}`}
              className="text-pink-400 hover:text-pink-300"
            >
              Sign in
            </Link>
            {" "}to reply.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
