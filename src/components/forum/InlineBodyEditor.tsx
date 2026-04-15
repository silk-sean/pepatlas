"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  /** "thread" or "reply" — controls API endpoint shape. */
  kind: "thread" | "reply";
  id: string;
  initialTitle?: string; // threads only
  initialBody: string;
  onCancel: () => void;
}

export function InlineBodyEditor({
  kind,
  id,
  initialTitle,
  initialBody,
  onCancel,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle || "");
  const [body, setBody] = useState(initialBody);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onSave() {
    setError(null);
    startTransition(async () => {
      const url =
        kind === "thread"
          ? `/api/forum/threads/${id}`
          : `/api/forum/replies/${id}`;
      const payload: { body: string; title?: string } = { body };
      if (kind === "thread") payload.title = title;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      onCancel();
      router.refresh();
    });
  }

  return (
    <div className="space-y-3 border border-pink-500/30 rounded-lg p-3 bg-[#1a1a22]">
      {kind === "thread" && (
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          maxLength={200}
        />
      )}
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={kind === "thread" ? 10 : 6}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex items-center gap-2">
        <Button onClick={onSave} disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
