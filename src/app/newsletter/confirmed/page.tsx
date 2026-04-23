import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Newsletter",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function ConfirmedPage({ searchParams }: Props) {
  const { status } = await searchParams;

  const messages: Record<
    string,
    { title: string; body: string; accent: string }
  > = {
    ok: {
      title: "You're in.",
      body: `Welcome. You'll get the ${SITE_NAME} weekly digest in your inbox every Monday.`,
      accent: "#d6ff00",
    },
    already: {
      title: "Already confirmed.",
      body: "Nothing to do — you're already on the list.",
      accent: "#7B2FFF",
    },
    invalid: {
      title: "Invalid link.",
      body: "That confirmation link isn't valid. Try subscribing again.",
      accent: "#FF2D78",
    },
    missing: {
      title: "Missing token.",
      body: "The confirmation link seems broken. Try subscribing again.",
      accent: "#FF2D78",
    },
  };

  const msg = messages[status ?? "ok"] ?? messages.ok;

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Card>
        <CardContent className="py-10 text-center">
          <div
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4"
            style={{
              backgroundColor: `${msg.accent}20`,
              color: msg.accent,
            }}
          >
            Newsletter
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">{msg.title}</h1>
          <p className="text-[#C5C5D4] mb-6">{msg.body}</p>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-[#FF2D78] px-4 py-2 text-sm font-bold text-white hover:bg-[#c41860]"
          >
            Back to {SITE_NAME} →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
