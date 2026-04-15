import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

interface ThreadHit {
  id: string;
  title: string;
  slug: string;
  body: string;
  createdAt: Date;
  replyCount: number;
  categorySlug: string;
  categoryName: string;
  authorUsername: string | null;
  rank: number;
  kind: "thread";
}

interface ReplyHit {
  id: string;
  body: string;
  createdAt: Date;
  threadId: string;
  threadTitle: string;
  threadSlug: string;
  categorySlug: string;
  categoryName: string;
  authorUsername: string | null;
  rank: number;
  kind: "reply";
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q || q.length < 2) {
    return NextResponse.json({ threads: [], replies: [], query: q });
  }

  // plainto_tsquery handles arbitrary user input safely (no FTS injection)
  const tsQuery = Prisma.sql`plainto_tsquery('english', ${q})`;

  const threadRows = await db.$queryRaw<ThreadHit[]>`
    SELECT
      t.id,
      t.title,
      t.slug,
      t.body,
      t."createdAt" AS "createdAt",
      t."replyCount" AS "replyCount",
      c.slug AS "categorySlug",
      c.name AS "categoryName",
      u.username AS "authorUsername",
      ts_rank(
        to_tsvector('english', COALESCE(t.title,'') || ' ' || COALESCE(t.body,'')),
        ${tsQuery}
      ) AS rank,
      'thread' AS kind
    FROM "Thread" t
    JOIN "ForumCategory" c ON c.id = t."categoryId"
    LEFT JOIN "User" u ON u.id = t."authorId"
    WHERE to_tsvector('english', COALESCE(t.title,'') || ' ' || COALESCE(t.body,''))
          @@ ${tsQuery}
    ORDER BY rank DESC, t."createdAt" DESC
    LIMIT 40
  `;

  const replyRows = await db.$queryRaw<ReplyHit[]>`
    SELECT
      r.id,
      r.body,
      r."createdAt" AS "createdAt",
      r."threadId" AS "threadId",
      t.title AS "threadTitle",
      t.slug AS "threadSlug",
      c.slug AS "categorySlug",
      c.name AS "categoryName",
      u.username AS "authorUsername",
      ts_rank(
        to_tsvector('english', COALESCE(r.body,'')),
        ${tsQuery}
      ) AS rank,
      'reply' AS kind
    FROM "Reply" r
    JOIN "Thread" t ON t.id = r."threadId"
    JOIN "ForumCategory" c ON c.id = t."categoryId"
    LEFT JOIN "User" u ON u.id = r."authorId"
    WHERE to_tsvector('english', COALESCE(r.body,'')) @@ ${tsQuery}
    ORDER BY rank DESC, r."createdAt" DESC
    LIMIT 40
  `;

  // Serialize dates to ISO
  return NextResponse.json({
    query: q,
    threads: threadRows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    replies: replyRows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
  });
}
