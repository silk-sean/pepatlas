"use client";

import { useEffect, useState } from "react";

/**
 * Render an ISO datetime in the user's local timezone. Avoids Next.js SSR
 * time-zone drift (server is UTC) by formatting only after mount.
 */
export function LocalTime({
  iso,
  mode = "datetime",
}: {
  iso: string | null | undefined;
  mode?: "datetime" | "date" | "time" | "relative";
}) {
  const [text, setText] = useState<string>(() => {
    if (!iso) return "—";
    // SSR placeholder — the bare ISO is at least unambiguous.
    return iso;
  });

  useEffect(() => {
    if (!iso) {
      setText("—");
      return;
    }
    const d = new Date(iso);
    if (mode === "relative") {
      const diff = d.getTime() - Date.now();
      const abs = Math.abs(diff);
      const mins = Math.round(abs / 60000);
      const hrs = Math.round(abs / 3600000);
      const days = Math.round(abs / 86400000);
      let rel: string;
      if (mins < 1) rel = "now";
      else if (mins < 60) rel = `${mins}m`;
      else if (hrs < 24) rel = `${hrs}h`;
      else rel = `${days}d`;
      setText(diff >= 0 ? `in ${rel}` : `${rel} ago`);
    } else if (mode === "date") {
      setText(d.toLocaleDateString());
    } else if (mode === "time") {
      setText(d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    } else {
      setText(d.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }));
    }
  }, [iso, mode]);

  return <span suppressHydrationWarning>{text}</span>;
}
