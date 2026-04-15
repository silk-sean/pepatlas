import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { NewThreadForm } from "@/components/forum/NewThreadForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "New Thread" };

export default async function NewThreadPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/forum/new");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/forum" className="hover:text-gray-900">Forums</Link>
        {" / "}
        <span className="text-gray-900">New thread</span>
      </nav>
      <Card>
        <CardHeader>
          <CardTitle>Start a new thread</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
            <NewThreadForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
