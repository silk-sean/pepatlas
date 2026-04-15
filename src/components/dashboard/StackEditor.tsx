"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { StackItem, UserStack } from "@/lib/stack";
import { MAX_STACK_ITEMS } from "@/lib/stack";

function emptyItem(): StackItem {
  return { compound: "", dose: "", frequency: "", route: "", notes: "" };
}

interface Props {
  initial: UserStack | null;
}

export function StackEditor({ initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [items, setItems] = useState<StackItem[]>(
    initial?.items && initial.items.length > 0 ? initial.items : [emptyItem()],
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  function updateItem(i: number, patch: Partial<StackItem>) {
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  function addItem() {
    if (items.length >= MAX_STACK_ITEMS) return;
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSave() {
    setSaving(true);
    setStatus(null);
    const filtered = items.filter((i) => i.compound.trim().length > 0);
    const body: UserStack = { title: title.trim() || undefined, items: filtered };
    const res = await fetch("/api/user/stack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setStatus(err.error || "Save failed");
    } else {
      setStatus("Saved");
      router.refresh();
    }
    setSaving(false);
  }

  async function onClear() {
    if (!confirm("Clear your stack signature?")) return;
    setSaving(true);
    await fetch("/api/user/stack", { method: "DELETE" });
    setItems([emptyItem()]);
    setTitle("");
    setStatus("Cleared");
    router.refresh();
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Signature Title (optional)</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. &quot;Current Stack&quot; or &quot;Week 3 of recovery&quot;"
          maxLength={40}
          className="mt-1"
        />
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="p-3 border border-gray-800 rounded-lg bg-[#1a1a22] space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">#{i + 1}</span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                placeholder="Compound (e.g. BPC-157)"
                value={item.compound}
                onChange={(e) => updateItem(i, { compound: e.target.value })}
                maxLength={60}
              />
              <Input
                placeholder="Dose (e.g. 500mcg)"
                value={item.dose || ""}
                onChange={(e) => updateItem(i, { dose: e.target.value })}
                maxLength={80}
              />
              <Input
                placeholder="Frequency (e.g. 2x/day)"
                value={item.frequency || ""}
                onChange={(e) => updateItem(i, { frequency: e.target.value })}
                maxLength={80}
              />
              <Input
                placeholder="Route (subQ / IM / oral)"
                value={item.route || ""}
                onChange={(e) => updateItem(i, { route: e.target.value })}
                maxLength={80}
              />
            </div>
            <Input
              placeholder="Notes (optional — week 4 of cycle, etc.)"
              value={item.notes || ""}
              onChange={(e) => updateItem(i, { notes: e.target.value })}
              maxLength={80}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          disabled={items.length >= MAX_STACK_ITEMS}
        >
          + Add Compound
        </Button>
        <Button type="button" onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save Stack Signature"}
        </Button>
        {initial && initial.items.length > 0 && (
          <Button type="button" variant="outline" onClick={onClear} disabled={saving}>
            Clear
          </Button>
        )}
        {status && <span className="text-sm text-pink-400">{status}</span>}
      </div>

      <p className="text-xs text-gray-500">
        Your stack signature will appear under every post you make, like GolfWRX&apos;s &ldquo;What&apos;s in the Bag&rdquo;.
        Max {MAX_STACK_ITEMS} items. Stays private unless you save.
      </p>
    </div>
  );
}
