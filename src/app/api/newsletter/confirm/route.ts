import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("t")?.trim();
  if (!token) {
    redirect(`${SITE_URL}/newsletter/confirmed?status=missing`);
  }

  const sub = await db.newsletterSubscriber.findUnique({
    where: { verifyToken: token },
  });
  if (!sub) {
    redirect(`${SITE_URL}/newsletter/confirmed?status=invalid`);
  }

  if (sub.verifiedAt && !sub.unsubscribedAt) {
    redirect(`${SITE_URL}/newsletter/confirmed?status=already`);
  }

  await db.newsletterSubscriber.update({
    where: { id: sub.id },
    data: {
      verifiedAt: new Date(),
      unsubscribedAt: null,
    },
  });

  redirect(`${SITE_URL}/newsletter/confirmed?status=ok`);
}
