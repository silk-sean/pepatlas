"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export function ProtocolEditor() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [goals, setGoals] = useState("");
  const [compounds, setCompounds] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !compounds.trim()) {
      setError("Name and compounds are required.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/protocols", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          data: {
            goals: goals.trim(),
            compounds: compounds.trim(),
            notes: notes.trim(),
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      setName("");
      setGoals("");
      setCompounds("");
      setNotes("");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="py-4">
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-wider text-[#666] font-semibold mb-1 block">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="e.g. 8-week healing stack"
              className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#FF2D78] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[#666] font-semibold mb-1 block">
              Goals (optional)
            </label>
            <input
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              maxLength={160}
              placeholder="e.g. tendon recovery, joint pain"
              className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#FF2D78] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[#666] font-semibold mb-1 block">
              Compounds + dosing
            </label>
            <textarea
              value={compounds}
              onChange={(e) => setCompounds(e.target.value)}
              rows={4}
              maxLength={1200}
              placeholder="BPC-157 250mcg 2x/day sub-Q
TB-500 5mg 1x/week loading, 2mg maintenance"
              className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#FF2D78] focus:outline-none resize-y font-mono"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[#666] font-semibold mb-1 block">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="Timing, concurrent supplements, observations…"
              className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#FF2D78] focus:outline-none resize-y"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Saving…" : "Save protocol"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
