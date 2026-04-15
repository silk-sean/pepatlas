"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  replyId: string;
  canEdit: boolean;
  canDelete: boolean;
  onEdit?: () => void;
}

export function ReplyModActions({ replyId, canEdit, canDelete, onEdit }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function onDelete() {
    if (!confirm("Delete this reply?")) return;
    startTransition(async () => {
      await fetch(`/api/forum/replies/${replyId}/delete`, { method: "POST" });
      router.refresh();
    });
  }

  if (!canEdit && !canDelete) return null;

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
