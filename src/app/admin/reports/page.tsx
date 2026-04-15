import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { ReportActions } from "@/components/admin/ReportActions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reports — Admin",
};

interface ReportsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminReportsPage({ searchParams }: ReportsPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin/reports");
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (me?.role !== "MODERATOR" && me?.role !== "ADMIN") redirect("/");

  const { status = "OPEN" } = await searchParams;
  const valid = ["OPEN", "RESOLVED", "DISMISSED"];
  const st = valid.includes(status) ? (status as "OPEN" | "RESOLVED" | "DISMISSED") : "OPEN";

  const reports = await db.report.findMany({
    where: { status: st },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      reporter: { select: { username: true, email: true } },
      resolver: { select: { username: true } },
      thread: {
        select: {
          id: true,
          title: true,
          body: true,
          category: { select: { slug: true } },
          author: { select: { username: true } },
        },
      },
      reply: {
        select: {
          id: true,
          body: true,
          threadId: true,
          thread: {
            select: {
              title: true,
              category: { select: { slug: true } },
            },
          },
          author: { select: { username: true } },
        },
      },
    },
  });

  const [openCount, resolvedCount, dismissedCount] = await Promise.all([
    db.report.count({ where: { status: "OPEN" } }),
    db.report.count({ where: { status: "RESOLVED" } }),
    db.report.count({ where: { status: "DISMISSED" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <nav className="text-sm text-[#9E9EAF] mb-3">
          <Link href="/admin" className="hover:text-white transition-colors">
            Admin
          </Link>
          {" / Reports"}
        </nav>
        <h1 className="text-3xl font-bold text-white tracking-tight">Reports</h1>
      </header>

      <div className="flex gap-2 mb-6">
        {(
          [
            { key: "OPEN", label: "Open", count: openCount, color: "#FF2D78" },
            { key: "RESOLVED", label: "Resolved", count: resolvedCount, color: "#d6ff00" },
            { key: "DISMISSED", label: "Dismissed", count: dismissedCount, color: "#9E9EAF" },
          ] as const
        ).map((tab) => {
          const active = st === tab.key;
          return (
            <Link
              key={tab.key}
              href={`/admin/reports?status=${tab.key}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "text-black border-transparent"
                  : "bg-transparent text-[#C5C5D4] border-[#333] hover:border-[#555]"
              }`}
              style={active ? { backgroundColor: tab.color } : undefined}
            >
              {tab.label} ({tab.count})
            </Link>
          );
        })}
      </div>

      {reports.length === 0 ? (
        <p className="text-[#9E9EAF]">No {st.toLowerCase()} reports.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => {
            const isThread = !!r.thread;
            const target = isThread ? r.thread! : r.reply!;
            const linkHref = isThread
              ? `/forum/${r.thread!.category.slug}/${r.thread!.id}`
              : `/forum/${r.reply!.thread.category.slug}/${r.reply!.threadId}#reply-${r.reply!.id}`;
            const title = isThread
              ? r.thread!.title
              : `Reply in "${r.reply!.thread.title}"`;
            const body = isThread ? r.thread!.body : r.reply!.body;
            const authorUsername = target.author?.username ?? "(deleted)";
            return (
              <Card key={r.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-[#9E9EAF] mb-1">
                        {isThread ? "Thread" : "Reply"} by{" "}
                        <span className="text-[#C5C5D4]">@{authorUsername}</span>
                        {" · reported by "}
                        <span className="text-[#C5C5D4]">
                          @{r.reporter?.username ?? "?"}
                        </span>
                        {" · "}
                        {new Date(r.createdAt).toLocaleString()}
                      </div>
                      <Link
                        href={linkHref}
                        className="text-base font-semibold text-white hover:text-[#FF2D78] transition-colors"
                      >
                        {title}
                      </Link>
                    </div>
                    {st === "OPEN" && (
                      <ReportActions reportId={r.id} />
                    )}
                    {st !== "OPEN" && r.resolver && (
                      <div className="text-xs text-[#9E9EAF]">
                        by @{r.resolver.username}
                        <br />
                        {r.resolvedAt && new Date(r.resolvedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="bg-[#0a0a0a] rounded-lg p-3 mb-3 border border-[#1f1f1f]">
                    <div className="text-[10px] uppercase tracking-wider text-[#666] mb-1">
                      Reason
                    </div>
                    <p className="text-sm text-[#C5C5D4]">{r.reason}</p>
                  </div>

                  <div className="bg-[#0a0a0a] rounded-lg p-3 border border-[#1f1f1f]">
                    <div className="text-[10px] uppercase tracking-wider text-[#666] mb-1">
                      Reported content (excerpt)
                    </div>
                    <p className="text-sm text-[#9E9EAF] line-clamp-4">{body}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
