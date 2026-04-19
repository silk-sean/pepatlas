"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PollOptionData {
  id: string;
  label: string;
  voteCount: number;
}

interface PollBlockProps {
  pollId: string;
  question: string;
  multipleChoice: boolean;
  closesAt: string | null;
  options: PollOptionData[];
  totalVotes: number;
  myVotedOptionIds: string[];
  isAuthed: boolean;
}

export function PollBlock({
  pollId,
  question,
  multipleChoice,
  closesAt,
  options,
  totalVotes,
  myVotedOptionIds,
  isAuthed,
}: PollBlockProps) {
  const router = useRouter();
  const [selection, setSelection] = useState<Set<string>>(
    new Set(myVotedOptionIds)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasVoted = myVotedOptionIds.length > 0;
  const [showResults, setShowResults] = useState(hasVoted);
  const closed = closesAt ? new Date(closesAt) < new Date() : false;
  const canSeeResults = showResults || hasVoted || closed || !isAuthed;

  function toggle(id: string) {
    setSelection((prev) => {
      const next = new Set(prev);
      if (multipleChoice) {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      } else {
        next.clear();
        next.add(id);
      }
      return next;
    });
  }

  async function submit() {
    if (selection.size === 0) {
      setError("Pick at least one option.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/forum/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ optionIds: Array.from(selection) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to vote");
        return;
      }
      setShowResults(true);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#333] bg-[#0f0f0f] p-5 mb-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wider text-[#7B2FFF] font-semibold mb-1">
            Poll{multipleChoice && " · multi-select"}
          </div>
          <h3 className="text-lg font-semibold text-white leading-snug">
            {question}
          </h3>
        </div>
        <div className="shrink-0 text-right text-xs text-[#9E9EAF]">
          {totalVotes} vote{totalVotes === 1 ? "" : "s"}
          {closesAt && (
            <div className="mt-0.5 text-[#666]">
              {closed
                ? "Closed"
                : `closes ${new Date(closesAt).toLocaleDateString()}`}
            </div>
          )}
        </div>
      </div>

      {canSeeResults ? (
        <div className="space-y-2">
          {options.map((o) => {
            const pct =
              totalVotes > 0 ? Math.round((o.voteCount / totalVotes) * 100) : 0;
            const myVote = myVotedOptionIds.includes(o.id);
            return (
              <div
                key={o.id}
                className={`relative overflow-hidden rounded-lg border ${
                  myVote ? "border-[#7B2FFF]" : "border-[#333]"
                } bg-[#111]`}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-[#7B2FFF]/15"
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between px-3 py-2 text-sm">
                  <span className="text-white">
                    {myVote && (
                      <span className="inline-block mr-1 text-[#7B2FFF]">✓</span>
                    )}
                    {o.label}
                  </span>
                  <span className="tabular-nums text-[#C5C5D4] font-medium">
                    {pct}% <span className="text-[#666]">· {o.voteCount}</span>
                  </span>
                </div>
              </div>
            );
          })}
          {isAuthed && !closed && (
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => setShowResults(false)}
                className="text-xs text-[#9E9EAF] hover:text-white underline"
              >
                {hasVoted ? "Change vote" : "Hide results & vote"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {options.map((o) => {
            const selected = selection.has(o.id);
            return (
              <button
                key={o.id}
                onClick={() => toggle(o.id)}
                disabled={submitting || closed}
                type="button"
                className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors ${
                  selected
                    ? "border-[#7B2FFF] bg-[#7B2FFF]/10 text-white"
                    : "border-[#333] bg-[#111] text-[#C5C5D4] hover:border-[#555]"
                }`}
              >
                <span
                  className={`inline-block mr-2 w-3.5 h-3.5 rounded-full border ${
                    selected ? "bg-[#7B2FFF] border-[#7B2FFF]" : "border-[#555]"
                  }`}
                />
                {o.label}
              </button>
            );
          })}
          {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={submit}
              disabled={submitting || selection.size === 0}
              className="rounded-lg bg-[#7B2FFF] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#6520e0] disabled:opacity-50 transition-colors"
            >
              {submitting ? "Voting…" : "Vote"}
            </button>
            {totalVotes > 0 && (
              <button
                onClick={() => setShowResults(true)}
                type="button"
                className="text-xs text-[#9E9EAF] hover:text-white underline"
              >
                See current results
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
