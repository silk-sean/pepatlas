"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  threadId: string;
}

export function CreatePollForm({ threadId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [multipleChoice, setMultipleChoice] = useState(false);
  const [closesIn, setClosesIn] = useState<"none" | "1d" | "1w" | "1m">("none");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setOptionAt(i: number, v: string) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? v : o)));
  }

  function addOption() {
    if (options.length >= 10) return;
    setOptions((prev) => [...prev, ""]);
  }

  function removeOption(i: number) {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cleanOpts = options.map((o) => o.trim()).filter(Boolean);
    if (question.trim().length < 3) {
      setError("Question required.");
      return;
    }
    if (cleanOpts.length < 2) {
      setError("At least 2 options required.");
      return;
    }
    let closesAt: string | null = null;
    if (closesIn !== "none") {
      const d = new Date();
      if (closesIn === "1d") d.setDate(d.getDate() + 1);
      if (closesIn === "1w") d.setDate(d.getDate() + 7);
      if (closesIn === "1m") d.setMonth(d.getMonth() + 1);
      closesAt = d.toISOString();
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/forum/polls", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          threadId,
          question: question.trim(),
          options: cleanOpts,
          multipleChoice,
          closesAt,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to create poll");
        return;
      }
      setOpen(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs rounded-lg border border-[#7B2FFF] text-[#7B2FFF] hover:bg-[#7B2FFF]/10 px-3 py-1.5 transition-colors"
      >
        + Add a poll
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-[#7B2FFF]/40 bg-[#0f0f0f] p-4 mb-5 space-y-3"
    >
      <div>
        <label className="text-xs uppercase tracking-wider text-[#7B2FFF] font-semibold mb-1 block">
          Poll question
        </label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What's the question?"
          maxLength={240}
          className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#7B2FFF] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-[#666] font-semibold mb-1 block">
          Options (2–10)
        </label>
        <div className="space-y-2">
          {options.map((o, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={o}
                onChange={(e) => setOptionAt(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                maxLength={120}
                className="flex-1 rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#7B2FFF] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeOption(i)}
                disabled={options.length <= 2}
                className="text-xs text-[#666] hover:text-[#FF2D78] disabled:opacity-30 px-2"
              >
                ✕
              </button>
            </div>
          ))}
          {options.length < 10 && (
            <button
              type="button"
              onClick={addOption}
              className="text-xs text-[#7B2FFF] hover:underline"
            >
              + Add option
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-sm text-[#C5C5D4]">
          <input
            type="checkbox"
            checked={multipleChoice}
            onChange={(e) => setMultipleChoice(e.target.checked)}
          />
          Allow multiple answers
        </label>
        <select
          value={closesIn}
          onChange={(e) => setClosesIn(e.target.value as typeof closesIn)}
          className="rounded-lg border border-[#333] bg-[#111] px-3 py-1.5 text-sm text-white"
        >
          <option value="none">Never closes</option>
          <option value="1d">Closes in 1 day</option>
          <option value="1w">Closes in 1 week</option>
          <option value="1m">Closes in 1 month</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[#7B2FFF] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#6520e0] disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create poll"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-[#9E9EAF] hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
