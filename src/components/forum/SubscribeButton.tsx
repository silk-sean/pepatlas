"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  threadId: string;
  initialSubscribed: boolean;
  isAuthed: boolean;
}

export function SubscribeButton({ threadId, initialSubscribed, isAuthed }: Props) {
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [pending, startTransition] = useTransition();

  async function onClick() {
    if (!isAuthed) {
      router.push(`/login?callbackUrl=${encodeURIComponent(location.pathname)}`);
      return;
    }
    const prev = subscribed;
    setSubscribed(!prev); // optimistic
    startTransition(async () => {
      const res = await fetch(`/api/forum/threads/${threadId}/subscribe`, { method: "POST" });
      if (!res.ok) setSubscribed(prev); // rollback on error
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={pending}
      className={subscribed ? "border-pink-500/50 text-pink-300" : ""}
    >
      {subscribed ? "🔔 Subscribed" : "🔕 Subscribe"}
    </Button>
  );
}
