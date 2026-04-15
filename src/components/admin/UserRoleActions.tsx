"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "MEMBER" | "MODERATOR" | "ADMIN";

interface Props {
  userId: string;
  currentRole: Role;
  isSelf: boolean;
}

export function UserRoleActions({ userId, currentRole, isSelf }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<Role | null>(null);

  async function setRole(role: Role) {
    if (isSelf) {
      alert("You can't change your own role.");
      return;
    }
    if (role === "MEMBER" && !confirm("Demote this user to MEMBER?")) return;
    if (role === "ADMIN" && !confirm("Grant ADMIN role? This gives full control of the site.")) return;
    setBusy(role);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role }),
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

  const btn = "text-xs px-2.5 py-1 rounded border transition-colors disabled:opacity-50 disabled:cursor-wait";

  return (
    <div className="flex gap-1.5 justify-end flex-wrap">
      {currentRole !== "MEMBER" && (
        <button
          onClick={() => setRole("MEMBER")}
          disabled={busy !== null || isSelf}
          className={`${btn} border-[#333] text-[#C5C5D4] hover:bg-[#1f1f1f]`}
        >
          {busy === "MEMBER" ? "…" : "Demote to Member"}
        </button>
      )}
      {currentRole !== "MODERATOR" && (
        <button
          onClick={() => setRole("MODERATOR")}
          disabled={busy !== null || isSelf}
          className={`${btn} border-[#7B2FFF] text-[#7B2FFF] hover:bg-[#7B2FFF]/10`}
        >
          {busy === "MODERATOR" ? "…" : "Make Mod"}
        </button>
      )}
      {currentRole !== "ADMIN" && (
        <button
          onClick={() => setRole("ADMIN")}
          disabled={busy !== null || isSelf}
          className={`${btn} border-[#d6ff00] text-[#d6ff00] hover:bg-[#d6ff00]/10`}
        >
          {busy === "ADMIN" ? "…" : "Make Admin"}
        </button>
      )}
    </div>
  );
}
