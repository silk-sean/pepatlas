"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ForumSearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? initialQuery);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed.length < 2) return;
    router.push(`/forum/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the forum…"
        className="w-full rounded-lg border border-[#333] bg-[#111] px-4 py-2 text-sm text-white placeholder:text-[#666] focus:border-[#FF2D78] focus:outline-none"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#666] hover:text-[#FF2D78]"
        aria-label="Search"
      >
        ⏎
      </button>
    </form>
  );
}
