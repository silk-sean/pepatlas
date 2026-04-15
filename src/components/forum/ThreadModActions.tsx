"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  threadId: string;
  categorySlug: string;
  isPinned: boolean;
  isLocked: boolean;
  /** Can the viewer edit the thread body (author or mod)? */
  canEdit: boolean;
  /** Can the viewer delete the thread (author or mod)? */
  canDelete: boolean;
  /** Can the viewer pin/lock (mod only)? */
  canModerate: boolean;
  /** Open the inline editor (sets state in parent client island). */
  onEdit?: () => void;
}

export function ThreadModActions({
  threadId,
  categorySlug,
  isPinned,
  isLocked,
  canEdit,
  canDelete,
  canModerate,
  onEdit,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function patch(data: object) {
    startTransition(async () => {
      await fetch(`/api/forum/threads/${threadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      router.refresh();
    });
  }

  async function onDelete() {
    if (!confirm("Permanently delete this thread?")) return;
    startTransition(async () => {
      const res = await fetch(`/api/forum/threads/${threadId}/delete`, {
        method: "POST",
      });
      if (res.ok) {
        router.push(`/forum/${categorySlug}`);
        router.refresh();
      }
    });
  }

  if (!canEdit && !canDelete && !canModerate) return null;

  return (
    <div className="flex items-center gap-3 text-xs">
      {canEdit && onEdit && (
        <button
          onClick={onEdit}
          disabled={pending}
          className="text-gray-500 hover:text-pink-400 transition-colors"
        >
          ✎ Edit
        </button>
      )}
      {canModerate && (
        <>
          <button
            onClick={() => patch({ isPinned: !isPinned })}
            disabled={pending}
            className={`transition-colors ${isPinned ? "text-pink-400" : "text-gray-500 hover:text-pink-400"}`}
          >
            {isPinned ? "📌 Unpin" : "📌 Pin"}
          </button>
          <button
            onClick={() => patch({ isLocked: !isLocked })}
            disabled={pending}
            className={`transition-colors ${isLocked ? "text-yellow-400" : "text-gray-500 hover:text-yellow-400"}`}
          >
            {isLocked ? "🔒 Unlock" : "🔒 Lock"}
          </button>
        </>
      )}
      {canDelete && (
        <button
          onClick={onDelete}
          disabled={pending}
          className="text-gray-500 hover:text-red-400 transition-colors"
        >
          🗑 Delete
        </button>
      )}
    </div>
  );
}
