import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your PepAtlas account
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
            <LoginForm />
          </Suspense>
          <p className="text-center text-sm text-gray-500 pt-2">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
