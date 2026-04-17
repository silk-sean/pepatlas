"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CategoryOption {
  id: string;
  slug: string;
  name: string;
  parent?: { name: string } | null;
}

export function NewThreadForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [category, setCategory] = useState<string>(searchParams.get("category") || "");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/forum/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || []);
        if (!category && data.categories?.[0]) {
          setCategory(data.categories[0].slug);
        }
      });
  }, [category]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, category, tags }),
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
        <Label htmlFor="category">Forum</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-700 bg-[#1a1a22] px-3 py-2 text-sm text-gray-200"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.parent ? `${c.parent.name} → ${c.name}` : c.name}
            </option>
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
          placeholder="What's on your mind? (markdown: **bold**, *italic*, > quote, - lists, [link](url))"
          required
          minLength={10}
          rows={10}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="tags">Tags (optional)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="comma-separated, e.g. bpc-157, recovery, tendon"
          maxLength={200}
          className="mt-1"
        />
        <p className="mt-1 text-xs text-gray-500">
          Up to 5 tags. Lowercase, 2–24 chars each.
        </p>
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
