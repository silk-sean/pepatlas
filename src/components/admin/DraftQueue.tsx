"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocalTime } from "./LocalTime";

export interface DraftItem {
  id: string;
  body: string;
  sourceType: string;
  sourceId: string;
  generatedAt: string;
  status: string;
  errorMessage: string;
  scheduledFor?: string | null;
}

/** `YYYY-MM-DDTHH:MM` in the browser's local tz, suitable for datetime-local. */
function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function defaultScheduleValue(fromIso?: string | null): string {
  const base = fromIso ? new Date(fromIso) : new Date(Date.now() + 60 * 60 * 1000);
  if (isNaN(base.getTime())) return toLocalInput(new Date(Date.now() + 60 * 60 * 1000));
  return toLocalInput(base);
}

export function DraftQueue({
  pending,
  scheduled = [],
}: {
  pending: DraftItem[];
  scheduled?: DraftItem[];
}) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [direction, setDirection] = useState("");
  const [stagger, setStagger] = useState(false);
  const [staggerCount, setStaggerCount] = useState(6);
  const [staggerHours, setStaggerHours] = useState(12);
  const [staggerStart, setStaggerStart] = useState(() =>
    toLocalInput(new Date(Date.now() + 5 * 60 * 1000)) // default now+5min
  );
  const [staggerBusy, setStaggerBusy] = useState(false);

  async function onStagger() {
    setGenError(null);
    setStaggerBusy(true);
    try {
      const startIso = new Date(staggerStart).toISOString();
      const res = await fetch("/api/admin/tweets/drafts/stagger", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          count: staggerCount,
          windowHours: staggerHours,
          startAt: startIso,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setGenError(data.error || "Stagger failed");
        return;
      }
      setStagger(false);
      router.refresh();
    } finally {
      setStaggerBusy(false);
    }
  }

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

  const minuteStep = staggerCount > 1 ? (staggerHours * 60) / (staggerCount - 1) : 0;

  return (
    <div className="space-y-4">
      {/* ── Top control panel ────────────────────────────────── */}
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
            placeholder='e.g. "focus on GLP-1 protocols" · "push the new sermorelin article" · "be dryer" · leave blank for free-range'
            className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder:text-[#555] focus:border-[#7B2FFF] focus:outline-none resize-y"
            disabled={generating}
          />
          <p className="text-[10px] text-[#555] mt-1">{direction.length}/500</p>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-[#666]">
            {pending.length === 0
              ? "Queue empty."
              : `${pending.length} pending · ${scheduled.length} scheduled`}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {pending.length > 0 && (
              <>
                <button
                  onClick={() => setStagger((s) => !s)}
                  disabled={generating || staggerBusy}
                  className="rounded-lg border border-[#333] px-3 py-1.5 text-xs text-[#C5C5D4] hover:bg-[#1a1a1a] disabled:opacity-50"
                >
                  {stagger ? "Close" : "Auto-stagger"}
                </button>
                <button
                  onClick={async () => {
                    if (!confirm(`Reject all ${pending.length} pending drafts?`))
                      return;
                    setGenError(null);
                    const res = await fetch("/api/admin/tweets/drafts/clear", {
                      method: "POST",
                    });
                    if (res.ok) router.refresh();
                  }}
                  disabled={generating || staggerBusy}
                  className="rounded-lg border border-[#333] px-3 py-1.5 text-xs text-[#9E9EAF] hover:bg-[#1a1a1a] disabled:opacity-50"
                >
                  Reject all
                </button>
              </>
            )}
            <button
              onClick={onGenerate}
              disabled={generating || staggerBusy}
              className="rounded-lg border border-[#7B2FFF] bg-[#7B2FFF]/10 px-3 py-1.5 text-xs font-medium text-[#7B2FFF] hover:bg-[#7B2FFF]/20 disabled:opacity-50"
            >
              {generating ? "Generating…" : "+ Generate drafts"}
            </button>
          </div>
        </div>

        {stagger && (
          <div className="rounded-lg border border-[#333] bg-[#0a0a0a] p-3 space-y-3">
            <p className="text-xs text-[#9E9EAF]">
              Schedules the oldest N pending drafts evenly across a window.
              First post at start, last at start + (N−1) × step.
              {minuteStep > 0 && (
                <>
                  {" "}
                  Step = <strong>{Math.round(minuteStep)}m</strong>.
                </>
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#9E9EAF] block mb-1">
                  Start at (your local time)
                </label>
                <input
                  type="datetime-local"
                  value={staggerStart}
                  onChange={(e) => setStaggerStart(e.target.value)}
                  className="w-full rounded border border-[#333] bg-[#111] px-2 py-1.5 text-xs text-white focus:border-[#7B2FFF] focus:outline-none"
                />
                <div className="flex gap-1 mt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setStaggerStart(toLocalInput(new Date(Date.now() + 5 * 60 * 1000)))
                    }
                    className="rounded border border-[#333] px-2 py-0.5 text-[10px] text-[#9E9EAF] hover:bg-[#1a1a1a]"
                  >
                    Now
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setHours(d.getHours() + 1, 0, 0, 0);
                      setStaggerStart(toLocalInput(d));
                    }}
                    className="rounded border border-[#333] px-2 py-0.5 text-[10px] text-[#9E9EAF] hover:bg-[#1a1a1a]"
                  >
                    Top of next hour
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 1);
                      d.setHours(9, 0, 0, 0);
                      setStaggerStart(toLocalInput(d));
                    }}
                    className="rounded border border-[#333] px-2 py-0.5 text-[10px] text-[#9E9EAF] hover:bg-[#1a1a1a]"
                  >
                    Tomorrow 9am
                  </button>
                </div>
              </div>

              <div className="flex items-end gap-3">
                <label className="flex-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#9E9EAF] block mb-1">
                    Tweets
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={staggerCount}
                    onChange={(e) =>
                      setStaggerCount(
                        Math.max(1, Math.min(20, Number(e.target.value) || 1))
                      )
                    }
                    className="w-full rounded border border-[#333] bg-[#111] px-2 py-1.5 text-xs text-white focus:border-[#7B2FFF] focus:outline-none"
                  />
                </label>
                <label className="flex-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#9E9EAF] block mb-1">
                    Over (hours)
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={168}
                    step={0.5}
                    value={staggerHours}
                    onChange={(e) =>
                      setStaggerHours(
                        Math.max(0.25, Math.min(168, Number(e.target.value) || 1))
                      )
                    }
                    className="w-full rounded border border-[#333] bg-[#111] px-2 py-1.5 text-xs text-white focus:border-[#7B2FFF] focus:outline-none"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={onStagger}
              disabled={
                staggerBusy || staggerCount < 1 || staggerCount > pending.length
              }
              className="w-full rounded bg-[#7B2FFF] px-3 py-2 text-xs font-semibold text-white hover:bg-[#6a24e0] disabled:opacity-50"
            >
              {staggerBusy
                ? "Scheduling…"
                : staggerCount > pending.length
                ? `Need ${staggerCount} drafts (have ${pending.length})`
                : `Schedule ${staggerCount} tweets starting at your chosen time`}
            </button>
          </div>
        )}
      </div>

      {genError && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {genError}
        </div>
      )}

      {/* ── Two-column board: Pending (left) · Scheduled (right) ── */}
      {pending.length === 0 && scheduled.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#333] p-8 text-center text-sm text-[#666]">
          Empty queue. Generate drafts to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#FF2D78] mb-2 sticky top-0 bg-[#0A0A0A] py-1 z-[1]">
              Pending ({pending.length})
            </h3>
            {pending.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#222] p-6 text-center text-xs text-[#555]">
                No pending drafts. Generate more?
              </div>
            ) : (
              <div className="space-y-2">
                {pending.map((d) => (
                  <DraftCard key={d.id} draft={d} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7B2FFF] mb-2 sticky top-0 bg-[#0A0A0A] py-1 z-[1]">
              Scheduled ({scheduled.length})
            </h3>
            {scheduled.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#222] p-6 text-center text-xs text-[#555]">
                Nothing scheduled. Auto-stagger pending drafts or schedule
                individually.
              </div>
            ) : (
              <div className="space-y-2">
                {scheduled.map((d) => (
                  <DraftCard key={d.id} draft={d} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function DraftCard({ draft }: { draft: DraftItem }) {
  const router = useRouter();
  const isScheduled = draft.status === "APPROVED" && !!draft.scheduledFor;
  const isFailed = draft.status === "FAILED";

  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(draft.body);
  const [busy, setBusy] = useState<
    null | "approve" | "reject" | "save" | "schedule" | "unschedule"
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleAt, setScheduleAt] = useState(() =>
    defaultScheduleValue(draft.scheduledFor)
  );

  const chars = body.length;
  const over = chars > 280;

  async function callAction(
    action: "approve" | "reject" | "unschedule",
    extra?: Record<string, unknown>
  ) {
    setError(null);
    setBusy(action);
    try {
      const res = await fetch(`/api/admin/tweets/drafts/${draft.id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, ...(extra ?? {}) }),
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

  async function onSchedule() {
    setError(null);
    setBusy("schedule");
    try {
      const iso = new Date(scheduleAt).toISOString();
      const res = await fetch(`/api/admin/tweets/drafts/${draft.id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "schedule", scheduledFor: iso }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }
      setScheduling(false);
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
        isFailed
          ? "border-red-500/40 bg-red-500/5"
          : isScheduled
          ? "border-[#7B2FFF]/30 bg-[#7B2FFF]/5"
          : "border-[#333] bg-[#111]"
      }`}
    >
      <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#666]">
          {draft.sourceType || "draft"}
          {isFailed && <span className="ml-2 text-red-400">FAILED</span>}
          {isScheduled && (
            <span className="ml-2 text-[#7B2FFF]">SCHEDULED</span>
          )}
        </span>
        <span className="text-[10px] text-[#555]">
          generated <LocalTime iso={draft.generatedAt} />
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
        <p className="mt-2 text-xs text-red-400">
          Last error: {draft.errorMessage}
        </p>
      )}

      {isScheduled && !scheduling && !editing && (
        <p className="mt-2 text-xs text-[#7B2FFF]">
          Posts at <LocalTime iso={draft.scheduledFor!} /> (
          <LocalTime iso={draft.scheduledFor!} mode="relative" />)
        </p>
      )}

      {scheduling && (
        <div className="mt-3 flex items-center gap-2 flex-wrap rounded-lg border border-[#333] bg-[#0a0a0a] p-2.5">
          <label className="text-[10px] uppercase tracking-wider text-[#9E9EAF]">
            {isScheduled ? "Reschedule to" : "Post at"}
          </label>
          <input
            type="datetime-local"
            value={scheduleAt}
            onChange={(e) => setScheduleAt(e.target.value)}
            className="rounded border border-[#333] bg-[#111] px-2 py-1 text-xs text-white focus:border-[#7B2FFF] focus:outline-none"
          />
          <button
            onClick={onSchedule}
            disabled={busy !== null || !scheduleAt}
            className="rounded bg-[#7B2FFF] px-3 py-1 text-xs font-semibold text-white hover:bg-[#6a24e0] disabled:opacity-50"
          >
            {busy === "schedule" ? "…" : isScheduled ? "Save new time" : "Confirm"}
          </button>
          <button
            onClick={() => {
              setScheduling(false);
              setScheduleAt(defaultScheduleValue(draft.scheduledFor));
            }}
            className="rounded border border-[#333] px-2 py-1 text-xs text-[#666] hover:bg-[#1a1a1a]"
          >
            Cancel
          </button>
        </div>
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
                disabled={busy !== null}
                className="rounded border border-[#333] px-2.5 py-1 text-xs text-[#C5C5D4] hover:bg-[#1a1a1a] disabled:opacity-50"
              >
                Edit
              </button>

              <button
                onClick={() => setScheduling((s) => !s)}
                disabled={busy !== null}
                className="rounded border border-[#333] px-2.5 py-1 text-xs text-[#C5C5D4] hover:bg-[#1a1a1a] disabled:opacity-50"
              >
                {scheduling ? "Close" : isScheduled ? "Reschedule" : "Schedule"}
              </button>

              {isScheduled && (
                <button
                  onClick={() => callAction("unschedule")}
                  disabled={busy !== null}
                  className="rounded border border-[#333] px-2.5 py-1 text-xs text-[#9E9EAF] hover:bg-[#1a1a1a] disabled:opacity-50"
                >
                  {busy === "unschedule" ? "…" : "Unschedule"}
                </button>
              )}

              <button
                onClick={() => callAction("reject")}
                disabled={busy !== null}
                className="rounded border border-[#333] px-2.5 py-1 text-xs text-[#666] hover:bg-[#1a1a1a] disabled:opacity-50"
              >
                {busy === "reject" ? "…" : isScheduled ? "Cancel" : "Reject"}
              </button>

              <button
                onClick={() => callAction("approve")}
                disabled={busy !== null}
                className="rounded bg-[#1DA1F2] px-3 py-1 text-xs font-semibold text-white hover:bg-[#0d8bd9] disabled:opacity-50"
              >
                {busy === "approve"
                  ? "Posting…"
                  : isScheduled
                  ? "Post now"
                  : "Approve + Post"}
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
