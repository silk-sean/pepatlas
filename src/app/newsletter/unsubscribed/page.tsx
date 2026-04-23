import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Unsubscribed",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function UnsubPage({ searchParams }: Props) {
  const { status } = await searchParams;

  const messages: Record<
    string,
    { title: string; body: string; accent: string }
  > = {
    ok: {
      title: "Unsubscribed.",
      body: "You're off the list. No more emails from us.",
      accent: "#9E9EAF",
    },
    invalid: {
      title: "Invalid link.",
      body: "That unsubscribe link isn't valid — maybe already used.",
      accent: "#FF2D78",
    },
    missing: {
      title: "Missing token.",
      body: "Link seems broken.",
      accent: "#FF2D78",
    },
  };

  const msg = messages[status ?? "ok"] ?? messages.ok;

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Card>
        <CardContent className="py-10 text-center">
          <h1 className="text-2xl font-bold text-white mb-3">{msg.title}</h1>
          <p className="text-[#C5C5D4] mb-6">{msg.body}</p>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-[#333] px-4 py-2 text-sm text-[#C5C5D4] hover:bg-[#1a1a1a]"
          >
            Back to {SITE_NAME}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
