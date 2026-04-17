import { SITE_NAME, SITE_URL } from "@/lib/constants";

/**
 * Schema.org JSON-LD generators. Keeps our structured data generation in one
 * place so snippets across Google/Bing results are consistent.
 */

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/forum/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description:
      "Community platform for peptide research, protocols, and discussion.",
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

interface ArticleSchemaArgs {
  title: string;
  slug: string;
  summary: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
}

export function articleSchema(a: ArticleSchemaArgs) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.summary,
    url: `${SITE_URL}/articles/${a.slug}`,
    datePublished: new Date(a.publishedAt).toISOString(),
    dateModified: new Date(a.updatedAt ?? a.publishedAt).toISOString(),
    author: {
      "@type": "Organization",
      name: a.author || SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    articleSection: a.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/articles/${a.slug}`,
    },
  };
}

interface ThreadSchemaArgs {
  threadId: string;
  categorySlug: string;
  categoryName: string;
  title: string;
  body: string;
  authorUsername: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  replyCount: number;
  replies?: {
    id: string;
    body: string;
    authorUsername: string | null;
    createdAt: Date;
  }[];
}

export function threadSchema(t: ThreadSchemaArgs) {
  const url = `${SITE_URL}/forum/${t.categorySlug}/${t.threadId}`;
  return {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: t.title,
    url,
    mainEntityOfPage: url,
    articleBody: t.body.slice(0, 500),
    datePublished: t.createdAt.toISOString(),
    dateModified: (t.updatedAt ?? t.createdAt).toISOString(),
    author: {
      "@type": "Person",
      name: t.authorUsername || "PepAtlas member",
      ...(t.authorUsername
        ? { url: `${SITE_URL}/profile/${t.authorUsername}` }
        : {}),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    articleSection: t.categoryName,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ReplyAction",
      userInteractionCount: t.replyCount,
    },
    ...(t.replies && t.replies.length > 0
      ? {
          comment: t.replies.map((r) => ({
            "@type": "Comment",
            text: r.body.slice(0, 500),
            datePublished: r.createdAt.toISOString(),
            author: {
              "@type": "Person",
              name: r.authorUsername || "PepAtlas member",
              ...(r.authorUsername
                ? { url: `${SITE_URL}/profile/${r.authorUsername}` }
                : {}),
            },
          })),
        }
      : {}),
  };
}
