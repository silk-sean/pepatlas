"use client";

import { useState } from "react";

export function TweetComposer() {
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    url?: string;
    error?: string;
  } | null>(null);

  const chars = text.length;
  const overLimit = chars > 280;

  async function onPost() {
    setResult(null);
    setPosting(true);
    try {
      const res = await fetch("/api/admin/tweets/post", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, url: data.url });
        setText("");
      } else {
        setResult({ ok: false, error: data.error || "Post failed" });
      }
    } catch (e) {
      setResult({ ok: false, error: (e as Error).message });
    } finally {
      setPosting(false);
    }
  }

  async function onVerify() {
    setResult(null);
    setVerifying(true);
    try {
      const res = await fetch("/api/admin/tweets/post", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ verifyOnly: true }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setResult({ ok: true, url: data.url });
      } else {
        setResult({
          ok: false,
          error: data.error || "Credential check failed",
        });
      }
    } catch (e) {
      setResult({ ok: false, error: (e as Error).message });
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#333] bg-[#111] p-5 space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's happening on PepAtlas?"
        rows={5}
        className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-base text-white placeholder:text-[#555] focus:border-[#FF2D78] focus:outline-none resize-y"
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className={`text-sm font-mono ${overLimit ? "text-red-400" : chars > 260 ? "text-yellow-400" : "text-[#666]"}`}>
          {chars} / 280
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onVerify}
            disabled={verifying || posting}
            className="rounded-lg border border-[#333] px-3 py-2 text-xs text-[#C5C5D4] hover:bg-[#1a1a1a] disabled:opacity-50"
            type="button"
          >
            {verifying ? "Checking…" : "Verify API"}
          </button>
          <button
            onClick={onPost}
            disabled={posting || verifying || !text.trim() || overLimit}
            className="rounded-lg bg-[#FF2D78] px-5 py-2 text-sm font-bold text-white hover:bg-[#c41860] disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {posting ? "Posting…" : "Post to X"}
          </button>
        </div>
      </div>

      {result && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            result.ok
              ? "border-[#d6ff00]/40 bg-[#d6ff00]/5 text-[#d6ff00]"
              : "border-red-500/40 bg-red-500/10 text-red-400"
          }`}
        >
          {result.ok ? (
            <>
              <p className="font-semibold">
                {result.url?.includes("/status/") ? "Posted." : "Credentials OK."}
              </p>
              {result.url && (
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-xs break-all"
                >
                  {result.url}
                </a>
              )}
            </>
          ) : (
            <>
              <p className="font-semibold">Error</p>
              <p className="text-xs mt-1">{result.error}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
