import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/forum/categories — return flat list for dropdowns
export async function GET() {
  const categories = await db.forumCategory.findMany({
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      parentId: true,
      parent: { select: { name: true } },
    },
  });
  return NextResponse.json({ categories });
}
