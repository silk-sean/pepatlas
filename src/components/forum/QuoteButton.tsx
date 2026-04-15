"use client";

interface Props {
  author: string;
  body: string;
}

export function QuoteButton({ author, body }: Props) {
  function onClick() {
    window.dispatchEvent(
      new CustomEvent("pepatlas:quote", {
        detail: { author, body },
      }),
    );
    // Scroll to reply form
    document.querySelector("form textarea[name=reply-body]")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-gray-500 hover:text-pink-400 transition-colors"
      title="Quote this post in your reply"
    >
      ↩ Quote
    </button>
  );
}
