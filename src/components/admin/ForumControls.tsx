"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Stats {
  pendingJobs: number;
  doneJobs: number;
  failedJobs: number;
  totalGhosts: number;
  nextJobAt: string | null;
}

export function ForumControls({ stats }: { stats: Stats }) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | "freshen" | "engage">(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [threadsToTouch, setThreadsToTouch] = useState(40);
  const [windowHours, setWindowHours] = useState(48);

  async function onFreshen() {
    if (!confirm(`Freshen ${threadsToTouch} threads over the last ${windowHours}h? This will take a minute.`)) return;
    setError(null);
    setMessage(null);
    setBusy("freshen");
    try {
      const res = await fetch("/api/admin/forum/freshen", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ threadsToTouch, windowHours }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Freshen failed");
        return;
      }
      setMessage(
        `Done. ${data.threadsTouched} threads touched, ${data.repliesCreated} replies, ${data.newThreadsCreated} new threads. ${data.errors} errors.`
      );
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function onEngage() {
    setError(null);
    setMessage(null);
    setBusy("engage");
    try {
      const res = await fetch("/api/admin/forum/engage-now", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ limit: 25 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Engage failed");
        return;
      }
      setMessage(
        `Processed ${data.processed} ghost jobs. ${
          data.results?.filter((r: { ok: boolean }) => r.ok).length ?? 0
        } posted, ${
          data.results?.filter((r: { ok: boolean }) => !r.ok).length ?? 0
        } failed.`
      );
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat label="Pending jobs" value={stats.pendingJobs} color="#FF2D78" />
        <Stat label="Done" value={stats.doneJobs} color="#d6ff00" />
        <Stat label="Failed" value={stats.failedJobs} color="#ef4444" />
        <Stat label="Ghost users" value={stats.totalGhosts} color="#7B2FFF" />
        <Stat
          label="Next job"
          value={
            stats.nextJobAt
              ? new Date(stats.nextJobAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "—"
          }
          color="#9E9EAF"
        />
      </div>

      {/* Freshen */}
      <div className="rounded-xl border border-[#333] bg-[#0f0f0f] p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Freshen forum</h3>
          <p className="text-xs text-[#9E9EAF] mt-0.5">
            Generates AI replies from ghost users across stale threads with backdated timestamps spread across the chosen window. Also seeds any empty categories with a starter thread. Usually takes 30–90 seconds.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-xs text-[#C5C5D4]">
            Threads to touch
            <input
              type="number"
              min={5}
              max={100}
              value={threadsToTouch}
              onChange={(e) =>
                setThreadsToTouch(
                  Math.max(5, Math.min(100, Number(e.target.value) || 40))
                )
              }
              className="w-20 rounded border border-[#333] bg-[#111] px-2 py-1 text-xs text-white focus:border-[#7B2FFF] focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-[#C5C5D4]">
            Over last
            <input
              type="number"
              min={1}
              max={168}
              value={windowHours}
              onChange={(e) =>
                setWindowHours(
                  Math.max(1, Math.min(168, Number(e.target.value) || 48))
                )
              }
              className="w-20 rounded border border-[#333] bg-[#111] px-2 py-1 text-xs text-white focus:border-[#7B2FFF] focus:outline-none"
            />
            hours
          </label>
          <button
            onClick={onFreshen}
            disabled={busy !== null}
            className="rounded-lg border border-[#FF2D78] bg-[#FF2D78]/10 px-3 py-1.5 text-xs font-medium text-[#FF2D78] hover:bg-[#FF2D78]/20 disabled:opacity-50"
          >
            {busy === "freshen" ? "Freshening…" : "Freshen now"}
          </button>
        </div>
      </div>

      {/* Engage */}
      <div className="rounded-xl border border-[#333] bg-[#0f0f0f] p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Process ghost queue now</h3>
          <p className="text-xs text-[#9E9EAF] mt-0.5">
            Immediately processes all pending ghost-reply jobs, ignoring their scheduled times. Useful after a real user posts if you want immediate engagement instead of waiting for the cron.
          </p>
        </div>
        <button
          onClick={onEngage}
          disabled={busy !== null || stats.pendingJobs === 0}
          className="rounded-lg border border-[#7B2FFF] bg-[#7B2FFF]/10 px-3 py-1.5 text-xs font-medium text-[#7B2FFF] hover:bg-[#7B2FFF]/20 disabled:opacity-50"
        >
          {busy === "engage"
            ? "Processing…"
            : stats.pendingJobs === 0
            ? "No pending jobs"
            : `Process ${stats.pendingJobs} pending`}
        </button>
      </div>

      {message && (
        <div className="rounded-lg border border-[#d6ff00]/30 bg-[#d6ff00]/10 px-3 py-2 text-xs text-[#d6ff00]">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-[#333] bg-[#0f0f0f] px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-[#666]">
        {label}
      </div>
      <div className="text-lg font-semibold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
