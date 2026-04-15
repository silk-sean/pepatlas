"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ReplyForm({ threadId }: { threadId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/forum/threads/${threadId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to post reply");
        return;
      }
      setBody("");
      router.refresh();
    } catch (e) {
      setError((e as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your reply…"
        required
        minLength={1}
        rows={5}
      />
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Posting…" : "Post Reply"}
      </Button>
    </form>
  );
}
