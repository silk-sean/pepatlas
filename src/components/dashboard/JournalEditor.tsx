"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export function JournalEditor() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(today);
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 10);
      const res = await fetch("/api/user/journal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          date,
          tags: tagList,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      setTitle("");
      setBody("");
      setTags("");
      setDate(today);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="py-4">
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#666] font-semibold mb-1 block">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={160}
                placeholder="e.g. Week 3 check-in"
                className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#FF2D78] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[#666] font-semibold mb-1 block">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#FF2D78] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[#666] font-semibold mb-1 block">
              Entry
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              maxLength={4000}
              placeholder="Dose, timing, observations, side effects, labs, etc."
              className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#FF2D78] focus:outline-none resize-y"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[#666] font-semibold mb-1 block">
              Tags (comma-separated, optional)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              maxLength={200}
              placeholder="bpc-157, recovery, week-3"
              className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#FF2D78] focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Saving…" : "Add entry"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
