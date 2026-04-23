import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ForumControls } from "@/components/admin/ForumControls";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Forum Engagement — Admin",
};

export default async function AdminForumPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin/forum");
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (me?.role !== "ADMIN") redirect("/");

  const [pending, done, failed, ghosts, nextJob, recentJobs] = await Promise.all([
    db.ghostReplyJob.count({ where: { status: "PENDING" } }),
    db.ghostReplyJob.count({ where: { status: "DONE" } }),
    db.ghostReplyJob.count({ where: { status: "FAILED" } }),
    db.user.count({ where: { email: { endsWith: "@seed.pepatlas.local" } } }),
    db.ghostReplyJob.findFirst({
      where: { status: "PENDING" },
      orderBy: { scheduledFor: "asc" },
      select: { scheduledFor: true },
    }),
    db.ghostReplyJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      select: {
        id: true,
        kind: true,
        threadId: true,
        status: true,
        scheduledFor: true,
        completedAt: true,
        errorMessage: true,
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <nav className="text-sm text-[#9E9EAF] mb-3">
          <Link href="/admin" className="hover:text-white transition-colors">
            Admin
          </Link>
          {" / Forum"}
        </nav>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Forum Engagement
        </h1>
        <p className="mt-2 text-[#9E9EAF]">
          Keep the community looking alive. Freshen stale threads with
          AI-drafted ghost replies, and inspect the auto-engagement queue.
          Real users trigger ghost replies automatically.
        </p>
      </header>

      <section className="mb-8">
        <ForumControls
          stats={{
            pendingJobs: pending,
            doneJobs: done,
            failedJobs: failed,
            totalGhosts: ghosts,
            nextJobAt: nextJob?.scheduledFor?.toISOString() ?? null,
          }}
        />
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9E9EAF] mb-3">
          Recent jobs ({recentJobs.length})
        </h2>
        {recentJobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#333] p-8 text-center text-sm text-[#666]">
            No ghost jobs yet. They queue automatically when real users post.
          </div>
        ) : (
          <div className="space-y-1.5">
            {recentJobs.map((j) => (
              <div
                key={j.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-[#222] bg-[#0f0f0f] px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider ${
                      j.status === "DONE"
                        ? "text-[#d6ff00]"
                        : j.status === "FAILED"
                        ? "text-red-400"
                        : "text-[#7B2FFF]"
                    }`}
                  >
                    {j.status}
                  </span>
                  <span className="text-[#9E9EAF] truncate">
                    {j.kind === "REPLY_TO_THREAD"
                      ? "→ thread reply"
                      : "→ child reply"}
                  </span>
                  {j.errorMessage && (
                    <span className="text-red-400 truncate">
                      {j.errorMessage}
                    </span>
                  )}
                </div>
                <span className="text-[#555] text-[10px] shrink-0">
                  sched {new Date(j.scheduledFor).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
