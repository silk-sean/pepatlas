"use client";

import { useState } from "react";

interface Props {
  source?: string;
  /** "footer" variant is compact, "inline" is more prominent */
  variant?: "footer" | "inline";
  className?: string;
}

export function NewsletterSignup({
  source = "footer",
  variant = "footer",
  className = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "sent"; email: string }
    | { kind: "error"; msg: string }
  >({ kind: "idle" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes("@")) return;
    setSubmitting(true);
    setState({ kind: "idle" });
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: trimmed, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState({ kind: "sent", email: trimmed });
        setEmail("");
      } else {
        setState({ kind: "error", msg: data.error || "Something went wrong" });
      }
    } catch (e) {
      setState({ kind: "error", msg: (e as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  if (state.kind === "sent") {
    return (
      <div
        className={`rounded-lg border border-[#d6ff00]/40 bg-[#d6ff00]/5 px-4 py-3 text-sm ${className}`}
      >
        <p className="text-[#d6ff00] font-medium">Check your email.</p>
        <p className="text-[#C5C5D4] mt-1 text-xs">
          Sent a confirmation link to{" "}
          <span className="text-white">{state.email}</span>. Click it to finish
          subscribing.
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={`rounded-2xl border border-[#333] bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 ${className}`}
      >
        <div className="text-xs font-semibold uppercase tracking-wider text-[#FF2D78] mb-2">
          Stay in the loop
        </div>
        <h3 className="text-xl font-bold text-white mb-1">
          Weekly peptide digest
        </h3>
        <p className="text-sm text-[#9E9EAF] mb-4">
          Best forum threads + new articles, once a week. No spam, unsubscribe anytime.
        </p>
        <form onSubmit={submit} className="flex gap-2 flex-wrap">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="flex-1 min-w-[200px] rounded-lg border border-[#333] bg-[#111] px-4 py-2 text-sm text-white placeholder:text-[#666] focus:border-[#FF2D78] focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting || !email.trim()}
            className="rounded-lg bg-[#FF2D78] px-5 py-2 text-sm font-bold text-white hover:bg-[#c41860] disabled:opacity-50"
          >
            {submitting ? "…" : "Subscribe"}
          </button>
        </form>
        {state.kind === "error" && (
          <p className="mt-2 text-xs text-red-400">{state.msg}</p>
        )}
      </div>
    );
  }

  // Compact footer variant
  return (
    <form onSubmit={submit} className={`space-y-2 ${className}`}>
      <div className="flex gap-2 flex-wrap">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className="flex-1 min-w-[160px] rounded-md border border-[#333] bg-[#0a0a0a] px-3 py-1.5 text-sm text-white placeholder:text-[#555] focus:border-[#FF2D78] focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting || !email.trim()}
          className="rounded-md bg-[#FF2D78] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#c41860] disabled:opacity-50"
        >
          {submitting ? "…" : "Join"}
        </button>
      </div>
      {state.kind === "error" && (
        <p className="text-xs text-red-400">{state.msg}</p>
      )}
    </form>
  );
}
