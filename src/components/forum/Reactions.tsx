"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type ReactionType = "LIKE" | "AGREE" | "USEFUL" | "FUNNY" | "THANKS";

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "LIKE", emoji: "👍", label: "Like" },
  { type: "AGREE", emoji: "💯", label: "Agree" },
  { type: "USEFUL", emoji: "💡", label: "Useful" },
  { type: "FUNNY", emoji: "😂", label: "Funny" },
  { type: "THANKS", emoji: "🙏", label: "Thanks" },
];

export interface ReactionCount {
  type: ReactionType;
  count: number;
  reacted: boolean; // has current user reacted?
}

interface Props {
  threadId?: string;
  replyId?: string;
  initial: ReactionCount[];
  isAuthed: boolean;
}

export function Reactions({ threadId, replyId, initial, isAuthed }: Props) {
  const router = useRouter();
  const [counts, setCounts] = useState<ReactionCount[]>(initial);
  const [pending, startTransition] = useTransition();
  const [picker, setPicker] = useState(false);

  async function toggle(type: ReactionType) {
    if (!isAuthed) {
      router.push(`/login?callbackUrl=${encodeURIComponent(location.pathname)}`);
      return;
    }
    setPicker(false);
    // Optimistic
    setCounts((prev) => {
      const existing = prev.find((r) => r.type === type);
      if (existing) {
        return prev.map((r) =>
          r.type === type
            ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
            : r,
        );
      }
      return [...prev, { type, count: 1, reacted: true }];
    });

    startTransition(async () => {
      await fetch("/api/forum/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, threadId, replyId }),
      });
      router.refresh();
    });
  }

  const visible = counts.filter((r) => r.count > 0);

  return (
    <div className="flex items-center gap-2 flex-wrap mt-2">
      {visible.map((r) => {
        const meta = REACTIONS.find((m) => m.type === r.type)!;
        return (
          <button
            key={r.type}
            onClick={() => toggle(r.type)}
            disabled={pending}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
              r.reacted
                ? "bg-pink-500/20 border-pink-500/50 text-pink-200"
                : "bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700"
            }`}
            title={meta.label}
          >
            <span>{meta.emoji}</span>
            <span className="font-semibold">{r.count}</span>
          </button>
        );
      })}

      <div className="relative">
        <button
          onClick={() => setPicker((p) => !p)}
          disabled={pending}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
          title="Add reaction"
        >
          <span>😊</span>
          <span>+</span>
        </button>
        {picker && (
          <div className="absolute bottom-full left-0 mb-2 flex gap-1 bg-gray-900 border border-gray-700 rounded-lg p-2 shadow-xl z-10">
            {REACTIONS.map((r) => {
              const current = counts.find((c) => c.type === r.type);
              return (
                <button
                  key={r.type}
                  onClick={() => toggle(r.type)}
                  className={`text-lg hover:scale-125 transition-transform p-1 ${
                    current?.reacted ? "ring-2 ring-pink-500 rounded-full" : ""
                  }`}
                  title={r.label}
                >
                  {r.emoji}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
