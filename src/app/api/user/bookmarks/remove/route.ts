import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const type = String(form.get("type") ?? "");
  const targetId = String(form.get("targetId") ?? "");
  if (!type || !targetId) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  await db.bookmark
    .delete({
      where: {
        userId_type_targetId: {
          userId: session.user.id,
          type,
          targetId,
        },
      },
    })
    .catch(() => undefined);
  redirect("/dashboard/bookmarks");
}
