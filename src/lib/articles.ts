import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDirectory = path.join(process.cwd(), "content", "articles");

export type ArticleCategory =
  | "compounds"
  | "protocols"
  | "methods"
  | "beginner"
  | "science"
  | "safety";

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  category: ArticleCategory;
  tags?: string[];
  related?: string[];
  status: "draft" | "published" | "review";
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  summary: string;
  heroAccent?: "pink" | "purple" | "lime"; // theme color for hero
  pepperpediaSlug?: string; // wiki cross-link
  forumCategory?: string; // forum category to deep-link to
  featured?: boolean;
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  content: string;
  readingTime: string;
}

export const CATEGORY_META: Record<ArticleCategory, { label: string; accent: string; description: string }> = {
  compounds: {
    label: "Compounds",
    accent: "#FF2D78",
    description: "Deep-dives on individual peptides — what they do, how, and why.",
  },
  protocols: {
    label: "Protocols & Stacks",
    accent: "#7B2FFF",
    description: "Full stacks and cycle blueprints with timing and rationale.",
  },
  methods: {
    label: "Methods & How-To",
    accent: "#d6ff00",
    description: "Reconstitution, injection, storage, cycling — the mechanics.",
  },
  beginner: {
    label: "Beginner Guides",
    accent: "#FF2D78",
    description: "New to peptides? Start here.",
  },
  science: {
    label: "Science",
    accent: "#7B2FFF",
    description: "Mechanisms, receptor biology, and pharmacokinetics.",
  },
  safety: {
    label: "Safety & Bloodwork",
    accent: "#d6ff00",
    description: "Red flags, contraindications, labs worth tracking.",
  },
};

function readAllFiles(): Article[] {
  if (!fs.existsSync(contentDirectory)) return [];
  const categories = fs.readdirSync(contentDirectory);
  const articles: Article[] = [];
  for (const category of categories) {
    const categoryPath = path.join(contentDirectory, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;
    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const stats = readingTime(content);
      articles.push({
        frontmatter: data as ArticleFrontmatter,
        content,
        readingTime: stats.text,
      });
    }
  }
  return articles;
}

export function getAllArticles(): Article[] {
  return readAllFiles().filter((a) => a.frontmatter.status === "published");
}

export function getArticleBySlug(slug: string): Article | null {
  return getAllArticles().find((a) => a.frontmatter.slug === slug) ?? null;
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return getAllArticles().filter((a) => a.frontmatter.category === category);
}

export function getFeaturedArticles(limit = 6): Article[] {
  return getAllArticles()
    .filter((a) => a.frontmatter.featured)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime()
    )
    .slice(0, limit);
}

export function getRelatedArticles(article: Article, limit = 4): Article[] {
  const relatedSlugs = article.frontmatter.related ?? [];
  const all = getAllArticles();
  const explicit = all.filter((a) => relatedSlugs.includes(a.frontmatter.slug));
  if (explicit.length >= limit) return explicit.slice(0, limit);
  // Fill remaining with same-category articles (excluding self)
  const same = all
    .filter(
      (a) =>
        a.frontmatter.category === article.frontmatter.category &&
        a.frontmatter.slug !== article.frontmatter.slug &&
        !relatedSlugs.includes(a.frontmatter.slug)
    )
    .slice(0, limit - explicit.length);
  return [...explicit, ...same];
}

export function getAllSlugs(): string[] {
  return getAllArticles().map((a) => a.frontmatter.slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const a of getAllArticles()) {
    for (const t of a.frontmatter.tags ?? []) tags.add(t);
  }
  return Array.from(tags).sort();
}
