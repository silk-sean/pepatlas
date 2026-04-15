"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FORUM_CATEGORIES } from "@/lib/constants";

export function NewThreadForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get("category") || FORUM_CATEGORIES[0].slug;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, category }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to create thread");
        return;
      }
      router.push(`/forum/${data.category}/${data.thread.id}`);
      router.refresh();
    } catch (e) {
      setError((e as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          {FORUM_CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Thread title"
          required
          minLength={3}
          maxLength={200}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?"
          required
          minLength={10}
          rows={10}
          className="mt-1"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Posting…" : "Create Thread"}
      </Button>
    </form>
  );
}
