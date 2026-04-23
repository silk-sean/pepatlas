import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ReplyForm } from "@/components/forum/ReplyForm";
import { SubscribeButton } from "@/components/forum/SubscribeButton";
import { BookmarkButton } from "@/components/forum/BookmarkButton";
import { PollBlock } from "@/components/forum/PollBlock";
import { CreatePollForm } from "@/components/forum/CreatePollForm";
import { threadSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/constants";
import { PostCard } from "@/components/forum/PostCard";
import { buildReactionCounts } from "@/lib/reactions";

export const dynamic = "force-dynamic";

interface ThreadPageProps {
  params: Promise<{ category: string; threadId: string }>;
}

export async function generateMetadata({ params }: ThreadPageProps): Promise<Metadata> {
  const { category, threadId } = await params;
  const thread = await db.thread.findUnique({
    where: { id: threadId },
    select: { title: true, body: true },
  });
  if (!thread) return {};
  const description = thread.body.replace(/\s+/g, " ").trim().slice(0, 160);
  const canonical = `${SITE_URL}/forum/${category}/${threadId}`;
  return {
    title: thread.title,
    description,
    alternates: { canonical },
    openGraph: { title: thread.title, description, url: canonical },
  };
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
      tags: { select: { name: true, slug: true } },
      poll: {
        include: {
          options: {
            orderBy: { sortOrder: "asc" },
            include: {
              _count: { select: { votes: true } },
            },
          },
          votes: {
            select: { userId: true, optionId: true },
          },
        },
      },
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
  let bookmarked = false;
  if (viewerId) {
    const me = await db.user.findUnique({
      where: { id: viewerId },
      select: { role: true },
    });
    viewerRole = me?.role ?? null;
    const [sub, bm] = await Promise.all([
      db.threadSubscription.findUnique({
        where: { userId_threadId: { userId: viewerId, threadId } },
      }),
      db.bookmark.findUnique({
        where: {
          userId_type_targetId: {
            userId: viewerId,
            type: "thread",
            targetId: threadId,
          },
        },
      }),
    ]);
    subscribed = !!sub;
    bookmarked = !!bm;
  }
  const isMod = viewerRole === "MODERATOR" || viewerRole === "ADMIN";

  // Structured data for search engines: full DiscussionForumPosting with comments
  const schemaThread = threadSchema({
    threadId: thread.id,
    categorySlug: category,
    categoryName: cat.name,
    title: thread.title,
    body: thread.body,
    authorUsername: thread.author.username,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
    replyCount: thread.replyCount,
    replies: thread.replies.slice(0, 20).map((r) => ({
      id: r.id,
      body: r.body,
      authorUsername: r.author.username,
      createdAt: r.createdAt,
    })),
  });
  const schemaBreadcrumb = breadcrumbSchema([
    { name: "Forum", url: `${SITE_URL}/forum` },
    { name: cat.name, url: `${SITE_URL}/forum/${category}` },
    { name: thread.title, url: `${SITE_URL}/forum/${category}/${thread.id}` },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaThread) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
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
          {thread.tags && thread.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {thread.tags.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tags/${t.slug}`}
                  className="inline-flex items-center rounded-full border border-[#333] bg-[#111] px-2.5 py-0.5 text-xs text-[#C5C5D4] hover:border-[#FF2D78] hover:text-[#FF2D78] transition-colors"
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <BookmarkButton
            targetId={thread.id}
            type="thread"
            initialBookmarked={bookmarked}
            isAuthed={!!viewerId}
          />
          <SubscribeButton
            threadId={thread.id}
            initialSubscribed={subscribed}
            isAuthed={!!viewerId}
          />
        </div>
      </div>

      {thread.poll && (() => {
        const totalVotes = thread.poll.votes.length;
        const myVotedOptionIds = viewerId
          ? thread.poll.votes
              .filter((v) => v.userId === viewerId)
              .map((v) => v.optionId)
          : [];
        return (
          <PollBlock
            pollId={thread.poll.id}
            question={thread.poll.question}
            multipleChoice={thread.poll.multipleChoice}
            closesAt={thread.poll.closesAt?.toISOString() ?? null}
            options={thread.poll.options.map((o) => ({
              id: o.id,
              label: o.label,
              voteCount: o._count.votes,
            }))}
            totalVotes={totalVotes}
            myVotedOptionIds={myVotedOptionIds}
            isAuthed={!!viewerId}
          />
        );
      })()}

      {!thread.poll &&
        viewerId &&
        (thread.author.id === viewerId || isMod) && (
          <div className="mb-5">
            <CreatePollForm threadId={thread.id} />
          </div>
        )}

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
