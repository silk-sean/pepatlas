import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { ProtocolEditor } from "@/components/dashboard/ProtocolEditor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Saved Protocols — Dashboard",
};

export default async function ProtocolsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/protocols");

  const protocols = await db.savedProtocol.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, data: true, createdAt: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <nav className="text-sm text-[#9E9EAF] mb-3">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          {" / Saved Protocols"}
        </nav>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Saved Protocols
        </h1>
        <p className="mt-2 text-[#9E9EAF]">
          Save full peptide protocols so you can reference them later or share in
          the forum.
        </p>
      </header>

      <ProtocolEditor />

      <section className="mt-8">
        <h2 className="text-sm uppercase tracking-wider text-[#666] font-semibold mb-3">
          Your protocols ({protocols.length})
        </h2>
        {protocols.length === 0 ? (
          <p className="text-[#9E9EAF]">None yet. Create one above.</p>
        ) : (
          <div className="space-y-3">
            {protocols.map((p) => {
              const data = (p.data ?? {}) as {
                goals?: string;
                compounds?: string;
                notes?: string;
              };
              return (
                <Card key={p.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-base font-semibold text-white">
                        {p.name}
                      </h3>
                      <form action={`/api/user/protocols/${p.id}/delete`} method="POST">
                        <button
                          type="submit"
                          className="text-xs text-[#666] hover:text-[#FF2D78] transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                    {data.goals && (
                      <p className="text-sm text-[#C5C5D4] mb-1">
                        <span className="text-[#666]">Goals:</span> {data.goals}
                      </p>
                    )}
                    {data.compounds && (
                      <p className="text-sm text-[#C5C5D4] mb-1 whitespace-pre-wrap">
                        <span className="text-[#666]">Compounds:</span>{" "}
                        {data.compounds}
                      </p>
                    )}
                    {data.notes && (
                      <p className="text-sm text-[#9E9EAF] mt-2 whitespace-pre-wrap">
                        {data.notes}
                      </p>
                    )}
                    <p className="text-xs text-[#666] mt-2">
                      Saved {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
