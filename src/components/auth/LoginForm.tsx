"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/forum";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid credentials");
        return;
      }
      router.push(callbackUrl);
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
        <Label htmlFor="identifier">Email or Username</Label>
        <Input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="you@example.com or username"
          className="mt-1"
          required
          autoComplete="username"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-1"
          required
          autoComplete="current-password"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </p>
      )}
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
