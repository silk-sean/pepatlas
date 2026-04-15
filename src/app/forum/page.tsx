import Link from "next/link";
import type { Metadata } from "next";
import { FORUM_CATEGORIES } from "@/lib/constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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
  // Get thread counts per category
  const categoryCounts = await db.forumCategory.findMany({
    select: { slug: true, _count: { select: { threads: true } } },
  });
  const countMap = new Map(categoryCounts.map((c) => [c.slug, c._count.threads]));
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-10">
        {/* Main Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Forums</h1>
              <p className="mt-2 text-gray-600">
                Discuss peptides, share protocols, and learn from the community.
              </p>
            </div>
            <Link
              href="/forum/new"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              New Thread
            </Link>
          </div>

          <div className="space-y-4">
            {FORUM_CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/forum/${cat.slug}`}>
                <Card className="hover:border-blue-300 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {cat.name}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {cat.description}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {countMap.get(cat.slug) ?? 0} threads
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          {/* Forum Rules */}
          <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-sm font-semibold text-gray-900">
              Forum Guidelines
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
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

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          <SupplierBadge />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Community Stats</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Members</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Threads</p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
