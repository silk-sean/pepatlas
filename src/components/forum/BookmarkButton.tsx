"use client";

import { useState } from "react";

interface Props {
  targetId: string;
  type?: "thread" | "article" | "protocol";
  initialBookmarked: boolean;
  isAuthed: boolean;
}

export function BookmarkButton({
  targetId,
  type = "thread",
  initialBookmarked,
  isAuthed,
}: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [busy, setBusy] = useState(false);

  if (!isAuthed) return null;

  async function toggle() {
    setBusy(true);
    try {
      const res = await fetch("/api/user/bookmarks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ targetId, type, action: "toggle" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setBookmarked(Boolean(data.bookmarked));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors disabled:opacity-50 ${
        bookmarked
          ? "border-[#d6ff00] text-[#d6ff00] bg-[#d6ff00]/10"
          : "border-[#333] text-[#9E9EAF] hover:border-[#555] hover:text-white"
      }`}
      title={bookmarked ? "Remove bookmark" : "Save for later"}
    >
      <svg
        className="h-3.5 w-3.5"
        fill={bookmarked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
        />
      </svg>
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}
