import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { db } from "@/lib/db";
import { getAllArticles } from "@/lib/articles";

// Refresh at most every hour — enough for fresh threads / new articles to surface
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static + landing pages
  const staticPaths: { path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFreq: "daily" },
    { path: "/forum", priority: 0.9, changeFreq: "hourly" },
    { path: "/articles", priority: 0.9, changeFreq: "daily" },
    { path: "/tools", priority: 0.6, changeFreq: "weekly" },
    { path: "/tools/protocol-builder", priority: 0.5, changeFreq: "monthly" },
    { path: "/tools/cost-calculator", priority: 0.5, changeFreq: "monthly" },
  ];
  for (const s of staticPaths) {
    entries.push({
      url: `${SITE_URL}${s.path}`,
      lastModified: now,
      changeFrequency: s.changeFreq,
      priority: s.priority,
    });
  }

  // Forum categories
  try {
    const categories = await db.forumCategory.findMany({
      select: { slug: true },
    });
    for (const c of categories) {
      entries.push({
        url: `${SITE_URL}/forum/${c.slug}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  } catch {
    /* DB unavailable at build time is ok — ISR will refresh */
  }

  // Forum threads (all categories; limited to recent to avoid sitemap bloat)
  try {
    const threads = await db.thread.findMany({
      take: 2000,
      orderBy: { lastReplyAt: "desc" },
      select: {
        id: true,
        updatedAt: true,
        lastReplyAt: true,
        category: { select: { slug: true } },
      },
    });
    for (const t of threads) {
      entries.push({
        url: `${SITE_URL}/forum/${t.category.slug}/${t.id}`,
        lastModified: t.lastReplyAt ?? t.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  } catch {
    /* ok */
  }

  // Articles
  try {
    const articles = getAllArticles();
    for (const a of articles) {
      const pub = new Date(a.frontmatter.publishedAt);
      const mod = a.frontmatter.updatedAt
        ? new Date(a.frontmatter.updatedAt)
        : pub;
      entries.push({
        url: `${SITE_URL}/articles/${a.frontmatter.slug}`,
        lastModified: mod,
        changeFrequency: "monthly",
        priority: a.frontmatter.featured ? 0.85 : 0.7,
      });
    }
  } catch {
    /* ok */
  }

  return entries;
}
