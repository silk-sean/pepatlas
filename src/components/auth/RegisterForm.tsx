"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Auto sign-in after registration
      const result = await signIn("credentials", {
        identifier: email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Account created — please sign in.");
        router.push("/login");
        return;
      }
      router.push("/forum");
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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1"
          required
          autoComplete="email"
        />
      </div>
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="3-30 chars, letters, numbers, _ or -"
          className="mt-1"
          required
          minLength={3}
          maxLength={30}
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
          placeholder="At least 8 characters"
          className="mt-1"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </p>
      )}
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Creating Account…" : "Create Account"}
      </Button>
    </form>
  );
}
