import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  const googleEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );
  const magicLinkEnabled = Boolean(process.env.RESEND_API_KEY);
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
          {googleEnabled && (
            <>
              <GoogleButton />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#111118] px-2 text-gray-500">
                    or with email
                  </span>
                </div>
              </div>
            </>
          )}
          <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
            <LoginForm />
          </Suspense>
          {magicLinkEnabled && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#111118] px-2 text-gray-500">
                    or magic link
                  </span>
                </div>
              </div>
              <MagicLinkForm />
            </>
          )}
          <p className="text-center text-sm text-gray-500 pt-2">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-pink-400 hover:text-pink-300">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
