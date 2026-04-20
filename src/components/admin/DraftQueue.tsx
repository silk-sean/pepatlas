"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DraftItem {
  id: string;
  body: string;
  sourceType: string;
  sourceId: string;
  generatedAt: string;
  status: string;
  errorMessage: string;
}

export function DraftQueue({ drafts }: { drafts: DraftItem[] }) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [direction, setDirection] = useState("");

  async function onGenerate() {
    setGenError(null);
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/tweets/drafts/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          direction: direction.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenError(data.error || "Failed");
        return;
      }
      // Keep the direction so user can tweak + regenerate without retyping.
      router.refresh();
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#333] bg-[#0f0f0f] p-4 space-y-3">
        <div>
          <label className="text-xs uppercase tracking-wider font-semibold text-[#9E9EAF] mb-1.5 block">
            Direction (optional)
          </label>
          <textarea
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            maxLength={500}
            rows={2}
            placeholder='e.g. "focus on GLP-1 protocols this week" · "push the new sermorelin article" · "be dryer, less marketing" · leave blank for free-range'
            className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder:text-[#555] focus:border-[#7B2FFF] focus:outline-none resize-y"
            disabled={generating}
          />
          <p className="text-[10px] text-[#555] mt-1">
            {direction.length}/500
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-[#666]">
            {drafts.length === 0
              ? "Queue empty."
              : `${drafts.length} awaiting your call.`}
          </p>
          <div className="flex items-center gap-2">
            {drafts.length > 0 && (
              <button
                onClick={async () => {
                  if (!confirm(`Reject all ${drafts.length} pending drafts?`)) return;
                  setGenError(null);
                  const res = await fetch("/api/admin/tweets/drafts/clear", {
                    method: "POST",
                  });
                  if (res.ok) router.refresh();
                }}
                disabled={generating}
                className="rounded-lg border border-[#333] px-3 py-1.5 text-xs text-[#9E9EAF] hover:bg-[#1a1a1a] disabled:opacity-50"
              >
                Reject all
              </button>
            )}
            <button
              onClick={onGenerate}
              disabled={generating}
              className="rounded-lg border border-[#7B2FFF] bg-[#7B2FFF]/10 px-3 py-1.5 text-xs font-medium text-[#7B2FFF] hover:bg-[#7B2FFF]/20 disabled:opacity-50"
            >
              {generating ? "Generating…" : "+ Generate drafts"}
            </button>
          </div>
        </div>
      </div>

      {genError && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {genError}
        </div>
      )}

      {drafts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#333] p-8 text-center text-sm text-[#666]">
          Empty queue. Generate drafts to get started.
        </div>
      ) : (
        drafts.map((d) => <DraftCard key={d.id} draft={d} />)
      )}
    </div>
  );
}

function DraftCard({ draft }: { draft: DraftItem }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(draft.body);
  const [busy, setBusy] = useState<null | "approve" | "reject" | "save">(null);
  const [error, setError] = useState<string | null>(null);

  const chars = body.length;
  const over = chars > 280;

  async function call(action: "approve" | "reject", newBody?: string) {
    setError(null);
    setBusy(action);
    try {
      const res = await fetch(`/api/admin/tweets/drafts/${draft.id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action,
          ...(newBody !== undefined ? { body: newBody } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function onSave() {
    setError(null);
    setBusy("save");
    try {
      const res = await fetch(`/api/admin/tweets/drafts/${draft.id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "edit", body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }
      setEditing(false);
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div
      className={`rounded-xl border p-4 ${
        draft.status === "FAILED"
          ? "border-red-500/40 bg-red-500/5"
          : "border-[#333] bg-[#111]"
      }`}
    >
      <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#666]">
          {draft.sourceType || "draft"}
          {draft.status === "FAILED" && (
            <span className="ml-2 text-red-400">FAILED</span>
          )}
        </span>
        <span className="text-[10px] text-[#555]">
          {new Date(draft.generatedAt).toLocaleString()}
        </span>
      </div>

      {editing ? (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:border-[#FF2D78] focus:outline-none resize-y"
        />
      ) : (
        <p className="text-sm text-white leading-relaxed whitespace-pre-wrap break-words">
          {draft.body}
        </p>
      )}

      {draft.errorMessage && !editing && (
        <p className="mt-2 text-xs text-red-400">Last error: {draft.errorMessage}</p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
        <span
          className={`text-[11px] font-mono ${
            editing && over ? "text-red-400" : "text-[#666]"
          }`}
        >
          {editing ? `${chars}/280` : `${draft.body.length}/280`}
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          {editing ? (
            <>
              <button
                onClick={onSave}
                disabled={busy !== null || over || !body.trim()}
                className="rounded border border-[#333] px-2.5 py-1 text-xs text-[#C5C5D4] hover:bg-[#1a1a1a] disabled:opacity-50"
              >
                {busy === "save" ? "…" : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setBody(draft.body);
                  setError(null);
                }}
                className="rounded border border-[#333] px-2.5 py-1 text-xs text-[#666] hover:bg-[#1a1a1a]"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="rounded border border-[#333] px-2.5 py-1 text-xs text-[#C5C5D4] hover:bg-[#1a1a1a]"
              >
                Edit
              </button>
              <button
                onClick={() => call("reject")}
                disabled={busy !== null}
                className="rounded border border-[#333] px-2.5 py-1 text-xs text-[#666] hover:bg-[#1a1a1a] disabled:opacity-50"
              >
                {busy === "reject" ? "…" : "Reject"}
              </button>
              <button
                onClick={() => call("approve")}
                disabled={busy !== null}
                className="rounded bg-[#1DA1F2] px-3 py-1 text-xs font-semibold text-white hover:bg-[#0d8bd9] disabled:opacity-50"
              >
                {busy === "approve" ? "Posting…" : "Approve + Post"}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400 rounded border border-red-500/40 bg-red-500/10 px-2 py-1">
          {error}
        </p>
      )}
    </div>
  );
}
