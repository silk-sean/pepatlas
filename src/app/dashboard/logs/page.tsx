import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { JournalEditor } from "@/components/dashboard/JournalEditor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal — Dashboard",
};

export default async function JournalPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/logs");

  const entries = await db.journalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 100,
    select: {
      id: true,
      title: true,
      body: true,
      date: true,
      tags: true,
      createdAt: true,
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <nav className="text-sm text-[#9E9EAF] mb-3">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          {" / Journal"}
        </nav>
        <h1 className="text-3xl font-bold text-white tracking-tight">Journal</h1>
        <p className="mt-2 text-[#9E9EAF]">
          Private logs — only you can read these. Track doses, side effects,
          observations.
        </p>
      </header>

      <JournalEditor />

      <section className="mt-8">
        <h2 className="text-sm uppercase tracking-wider text-[#666] font-semibold mb-3">
          Entries ({entries.length})
        </h2>
        {entries.length === 0 ? (
          <p className="text-[#9E9EAF]">No entries yet.</p>
        ) : (
          <div className="space-y-3">
            {entries.map((e) => (
              <Card key={e.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                    <h3 className="text-base font-semibold text-white">
                      {e.title}
                    </h3>
                    <form
                      action={`/api/user/journal/${e.id}/delete`}
                      method="POST"
                    >
                      <button
                        type="submit"
                        className="text-xs text-[#666] hover:text-[#FF2D78] transition-colors"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                  <div className="text-xs text-[#9E9EAF] mb-2">
                    {new Date(e.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {e.tags.length > 0 && (
                      <span className="ml-3">
                        {e.tags.map((t) => `#${t}`).join(" ")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#C5C5D4] whitespace-pre-wrap">
                    {e.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
