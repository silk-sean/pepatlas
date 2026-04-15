import Link from "next/link";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SupplierBadge } from "@/components/shared/SupplierBadge";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Forums — Peptide Community",
  description:
    "Join the peptide community. Discuss protocols, share experiences, ask questions, and track your research journey.",
};

export default async function ForumPage() {
  // Load all categories with counts + sub-forums
  const categories = await db.forumCategory.findMany({
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }],
    include: {
      _count: { select: { threads: true } },
    },
  });

  // Build tree: top-level categories get their children attached
  const topLevel = categories.filter((c) => c.parentId === null);
  const childrenByParent = new Map<string, typeof categories>();
  for (const c of categories) {
    if (c.parentId) {
      const arr = childrenByParent.get(c.parentId) ?? [];
      arr.push(c);
      childrenByParent.set(c.parentId, arr);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-10">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Forums</h1>
              <p className="mt-2 text-gray-400">
                Discuss peptides, share protocols, and learn from the community.
              </p>
            </div>
            <Link
              href="/forum/new"
              className="inline-flex items-center rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 transition-colors"
            >
              New Thread
            </Link>
          </div>

          <div className="space-y-4">
            {topLevel.map((cat) => {
              const subs = childrenByParent.get(cat.id) ?? [];
              return (
                <Card key={cat.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <CardTitle className="text-base">
                          <Link
                            href={`/forum/${cat.slug}`}
                            className="hover:text-pink-400"
                          >
                            {cat.name}
                          </Link>
                        </CardTitle>
                        <p className="text-sm text-gray-400 mt-1">
                          {cat.description}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {cat._count.threads} threads
                      </Badge>
                    </div>
                  </CardHeader>
                  {subs.length > 0 && (
                    <CardContent className="pt-0">
                      <div className="grid sm:grid-cols-2 gap-2 border-t border-gray-800 pt-3">
                        {subs.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/forum/${sub.slug}`}
                            className="flex items-center justify-between rounded p-2 hover:bg-[#22222a] transition-colors"
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-200 truncate">
                                {sub.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {sub.description}
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 shrink-0 ml-2">
                              {sub._count.threads}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          <div className="mt-8 rounded-lg border border-gray-800 bg-[#1a1a22] p-6">
            <h3 className="text-sm font-semibold text-gray-200">
              Forum Guidelines
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li>
                All discussions are for educational and research purposes only
              </li>
              <li>No medical claims or treatment recommendations</li>
              <li>Be respectful — this is a community of learners</li>
              <li>
                No sourcing requests (use our Trusted Partners section instead)
              </li>
              <li>Include disclaimers when sharing personal experiences</li>
            </ul>
          </div>
        </div>

        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          <SupplierBadge />
        </aside>
      </div>
    </div>
  );
}
