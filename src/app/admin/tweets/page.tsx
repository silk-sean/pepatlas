import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { TweetComposer } from "@/components/admin/TweetComposer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tweets — Admin",
};

export default async function AdminTweetsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin/tweets");
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (me?.role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <nav className="text-sm text-[#9E9EAF] mb-3">
          <Link href="/admin" className="hover:text-white transition-colors">
            Admin
          </Link>
          {" / Tweets"}
        </nav>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Post to @pepatlas
        </h1>
        <p className="mt-2 text-[#9E9EAF]">
          Compose a tweet. Review it. Hit post. Live on X immediately.
        </p>
      </header>

      <TweetComposer />

      <div className="mt-10 rounded-xl border border-[#333] bg-[#111] p-4 text-xs text-[#9E9EAF] leading-relaxed">
        <p className="text-[#C5C5D4] font-semibold mb-1">Next phase (coming soon)</p>
        <p>
          AI-drafted tweet queue pulling from PepAtlas forum activity + articles,
          with an approval inbox so you just click ✅ on 2-3 candidates per day.
          For now, compose manually here.
        </p>
      </div>
    </div>
  );
}
