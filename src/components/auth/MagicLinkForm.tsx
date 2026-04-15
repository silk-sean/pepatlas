"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function MagicLinkForm({ callbackUrl }: { callbackUrl?: string }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      // NextAuth v5's email provider is registered as "nodemailer"
      const res = await signIn("nodemailer", {
        email: email.trim().toLowerCase(),
        redirect: false,
        callbackUrl: callbackUrl || "/forum",
      });
      if (res?.error) {
        setError("Could not send link. Try again in a moment.");
        return;
      }
      setSent(true);
    } catch (e) {
      setError((e as Error).message || "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-[#d6ff00]/40 bg-[#d6ff00]/5 px-4 py-3 text-sm">
        <p className="text-[#d6ff00] font-medium">Check your email.</p>
        <p className="text-[#C5C5D4] mt-1">
          A sign-in link is on its way to{" "}
          <span className="text-white">{email}</span>. It expires in 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <Label htmlFor="magic-email">Email</Label>
        <Input
          id="magic-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1"
          required
          autoComplete="email"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </p>
      )}
      <Button className="w-full" disabled={sending} type="submit" variant="outline">
        {sending ? "Sending…" : "Email me a sign-in link"}
      </Button>
    </form>
  );
}
