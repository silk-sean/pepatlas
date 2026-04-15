import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StackEditor } from "@/components/dashboard/StackEditor";
import { StackSignature } from "@/components/forum/StackSignature";
import { isValidStack, type UserStack } from "@/lib/stack";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Stack Signature" };

export default async function StackSignaturePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/stack");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { username: true, name: true, stackJson: true },
  });
  if (!user) redirect("/login");

  const initial = isValidStack(user.stackJson) ? (user.stackJson as UserStack) : null;
  const displayName = user.username || user.name || "you";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        {" / "}
        <span className="text-gray-300">Stack Signature</span>
      </nav>

      <h1 className="text-3xl font-bold text-white mb-2">Stack Signature</h1>
      <p className="text-gray-400 mb-8">
        Shown under every post you make — like GolfWRX&apos;s &ldquo;What&apos;s in the Bag&rdquo;,
        but for peptides.
      </p>

      <Card>
        <CardHeader><CardTitle>Edit</CardTitle></CardHeader>
        <CardContent>
          <StackEditor initial={initial} />
        </CardContent>
      </Card>

      {initial && initial.items.length > 0 && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
          <CardContent>
            <div className="text-sm text-gray-400 whitespace-pre-wrap">
              (your post body will appear here…)
            </div>
            <StackSignature stack={initial} username={displayName} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
