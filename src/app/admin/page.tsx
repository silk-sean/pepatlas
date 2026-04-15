import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — PepAtlas",
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin");
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (me?.role !== "ADMIN") redirect("/");

  const [
    userCount,
    adminCount,
    modCount,
    threadCount,
    replyCount,
    openReportCount,
    recentUsers,
    recentThreads,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "ADMIN" } }),
    db.user.count({ where: { role: "MODERATOR" } }),
    db.thread.count(),
    db.reply.count(),
    db.report.count({ where: { status: "OPEN" } }),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        postCount: true,
        createdAt: true,
      },
    }),
    db.thread.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        title: true,
        createdAt: true,
        category: { select: { slug: true, name: true } },
        author: { select: { username: true } },
        replyCount: true,
      },
    }),
  ]);

  const stats = [
    { label: "Users", value: userCount, accent: "#FF2D78", href: "/admin/users" },
    { label: "Admins", value: adminCount, accent: "#d6ff00", href: "/admin/users?role=ADMIN" },
    { label: "Moderators", value: modCount, accent: "#7B2FFF", href: "/admin/users?role=MODERATOR" },
    { label: "Threads", value: threadCount, accent: "#FF2D78", href: "/forum" },
    { label: "Replies", value: replyCount, accent: "#7B2FFF", href: "/forum" },
    {
      label: "Open Reports",
      value: openReportCount,
      accent: openReportCount > 0 ? "#FF2D78" : "#9E9EAF",
      href: "/admin/reports",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin</h1>
        <p className="mt-2 text-[#9E9EAF]">
          Site overview, user management, and moderation tools.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-[#333] bg-[#111] p-4 hover:border-[#555] transition-colors"
          >
            <div
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: s.accent }}
            >
              {s.label}
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{s.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base text-white">Recent Users</CardTitle>
            <Link
              href="/admin/users"
              className="text-xs text-[#FF2D78] hover:underline"
            >
              Manage all →
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-[#1f1f1f]">
            {recentUsers.map((u) => (
              <div
                key={u.id}
                className="py-2 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    @{u.username ?? "(no username)"}
                    {u.role !== "MEMBER" && (
                      <span
                        className="ml-2 text-[10px] uppercase tracking-wider font-bold"
                        style={{
                          color: u.role === "ADMIN" ? "#d6ff00" : "#7B2FFF",
                        }}
                      >
                        {u.role}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#666] truncate">{u.email}</div>
                </div>
                <div className="text-xs text-[#9E9EAF] text-right shrink-0">
                  {u.postCount} posts
                  <br />
                  <span className="text-[#666]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-white">Recent Threads</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-[#1f1f1f]">
            {recentThreads.length === 0 && (
              <p className="text-sm text-[#9E9EAF] py-2">No threads yet.</p>
            )}
            {recentThreads.map((t) => (
              <Link
                key={t.id}
                href={`/forum/${t.category.slug}/${t.id}`}
                className="py-2 block hover:bg-[#1a1a1a] -mx-2 px-2 rounded transition-colors"
              >
                <div className="text-sm font-medium text-white truncate">
                  {t.title}
                </div>
                <div className="text-xs text-[#9E9EAF] mt-0.5">
                  {t.category.name} · @{t.author.username ?? "?"} · {t.replyCount}{" "}
                  {t.replyCount === 1 ? "reply" : "replies"}
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
