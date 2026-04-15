import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplierBadge } from "@/components/shared/SupplierBadge";
import { PEPPERPEDIA_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Articles — Peptide Research & Education",
  description:
    "High-authority, research-grade articles on peptide dosing frameworks, recovery protocols, and optimization strategies.",
};

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-10">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
          <p className="mt-2 text-gray-600">
            In-depth educational content on peptide research, protocols, and
            optimization strategies.
          </p>

          {/* Placeholder articles */}
          <div className="mt-8 space-y-4">
            {[
              {
                title: "Understanding Peptide Dosing Frameworks",
                summary:
                  "A systematic approach to determining appropriate research doses based on published data, body weight considerations, and individual response assessment.",
                tags: ["dosing", "guide", "beginner"],
              },
              {
                title: "Foundational Recovery Protocol Structures",
                summary:
                  "How to structure a multi-compound recovery protocol using evidence-based approaches. Includes timing, stacking considerations, and progression models.",
                tags: ["recovery", "protocol", "intermediate"],
              },
              {
                title: "The Science of Peptide Reconstitution and Storage",
                summary:
                  "Beyond the basics: understanding solubility, stability curves, and optimal storage conditions for maintaining peptide integrity.",
                tags: ["methods", "storage", "advanced"],
              },
            ].map((article, i) => (
              <Card key={i} className="hover:border-blue-300 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {article.summary}
                  </p>
                  <div className="flex gap-2 mt-3">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-400">
                    Coming soon — articles are currently being written by our
                    editorial team.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          <SupplierBadge />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pepperpedia</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              <p>
                For encyclopedic compound information, visit our knowledge base.
              </p>
              <a
                href={PEPPERPEDIA_URL}
                className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Browse Pepperpedia
              </a>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
