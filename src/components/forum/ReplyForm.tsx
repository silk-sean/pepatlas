"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  threadId: string;
  initialBody?: string;
}

export function ReplyForm({ threadId, initialBody = "" }: Props) {
  const router = useRouter();
  const [body, setBody] = useState(initialBody);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // When quote button fires a window event, prepend the quote to the textarea
  useEffect(() => {
    function onQuote(e: Event) {
      const detail = (e as CustomEvent<{ author: string; body: string }>).detail;
      if (!detail) return;
      const quoted = `> **@${detail.author} wrote:**\n> ${detail.body.split("\n").join("\n> ")}\n\n`;
      setBody((prev) => quoted + prev);
      // Scroll the form into view + focus
      document.querySelector<HTMLTextAreaElement>("textarea[name=reply-body]")?.focus();
    }
    window.addEventListener("pepatlas:quote", onQuote as EventListener);
    return () => window.removeEventListener("pepatlas:quote", onQuote as EventListener);
  }, []);

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
        name="reply-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your reply… (markdown supported: **bold**, *italic*, > quote, - lists, [link](url))"
        required
        minLength={1}
        rows={6}
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
