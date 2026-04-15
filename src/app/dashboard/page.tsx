import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rankFor } from "@/lib/ranks";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      username: true,
      name: true,
      email: true,
      postCount: true,
      createdAt: true,
      _count: {
        select: {
          threads: true,
          replies: true,
          subscriptions: true,
        },
      },
    },
  });
  if (!user) redirect("/login");

  const rank = rankFor(user.postCount);
  const display = user.username || user.name || user.email;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">
        Welcome, <span className="text-gray-200">{display}</span>. Rank:{" "}
        <span className={rank.color}>{rank.name}</span>
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashCard
          href="/dashboard/stack"
          title="Stack Signature"
          desc="Set what you're currently running — displayed under every post."
          cta="Edit stack"
        />
        {user.username && (
          <DashCard
            href={`/profile/${user.username}`}
            title="My Profile"
            desc="Public profile other members see."
            cta="View profile"
          />
        )}
        <DashCard
          href="/dashboard/protocols"
          title="Saved Protocols"
          desc="Your saved protocol configurations."
          cta="Manage"
        />
        <DashCard
          href="/dashboard/logs"
          title="Journal"
          desc="Private log of your research journey."
          cta="Open journal"
        />
        <DashCard
          href="/dashboard/bookmarks"
          title="Bookmarks"
          desc="Saved threads, articles, and protocols."
          cta="View bookmarks"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <Stat label="Posts" value={user.postCount} />
        <Stat label="Threads" value={user._count.threads} />
        <Stat label="Replies" value={user._count.replies} />
        <Stat label="Subscribed" value={user._count.subscriptions} />
      </div>
    </div>
  );
}

function DashCard({
  href,
  title,
  desc,
  cta,
}: {
  href: string;
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="hover:border-pink-500/50 transition-colors h-full">
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">{desc}</p>
          <p className="text-xs text-pink-400 mt-3">{cta} →</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}
