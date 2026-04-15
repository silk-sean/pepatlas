"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReportActions({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"resolve" | "dismiss" | null>(null);

  async function act(action: "resolve" | "dismiss") {
    setBusy(action);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed");
        return;
      }
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => act("resolve")}
        disabled={busy !== null}
        className="text-xs px-3 py-1 rounded border border-[#d6ff00] text-[#d6ff00] hover:bg-[#d6ff00]/10 transition-colors disabled:opacity-50"
      >
        {busy === "resolve" ? "…" : "Resolve"}
      </button>
      <button
        onClick={() => act("dismiss")}
        disabled={busy !== null}
        className="text-xs px-3 py-1 rounded border border-[#333] text-[#C5C5D4] hover:bg-[#1f1f1f] transition-colors disabled:opacity-50"
      >
        {busy === "dismiss" ? "…" : "Dismiss"}
      </button>
    </div>
  );
}
