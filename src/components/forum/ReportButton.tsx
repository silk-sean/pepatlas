"use client";

import { useState } from "react";

interface Props {
  threadId?: string;
  replyId?: string;
  isAuthed: boolean;
}

export function ReportButton({ threadId, replyId, isAuthed }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!isAuthed) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (reason.trim().length < 3) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/forum/reports`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ threadId, replyId, reason: reason.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to report");
        return;
      }
      setDone(true);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <span className="text-[10px] text-[#666] uppercase tracking-wider">
        Reported ✓
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[10px] text-[#666] uppercase tracking-wider hover:text-[#FF2D78] transition-colors"
        type="button"
      >
        Report
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#333] bg-[#0f0f0f] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-white mb-2">
              Report {threadId ? "thread" : "reply"}
            </h3>
            <p className="text-xs text-[#9E9EAF] mb-4">
              Briefly describe the issue. Moderators will review.
            </p>
            <form onSubmit={submit}>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. spam, personal attack, dangerous misinformation…"
                rows={4}
                maxLength={500}
                className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white placeholder:text-[#666] focus:border-[#FF2D78] focus:outline-none resize-y"
              />
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs px-3 py-1.5 rounded border border-[#333] text-[#C5C5D4] hover:bg-[#1f1f1f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || reason.trim().length < 3}
                  className="text-xs px-3 py-1.5 rounded bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Reporting…" : "Submit report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
