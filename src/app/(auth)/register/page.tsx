import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { GoogleButton } from "@/components/auth/GoogleButton";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  const googleEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join PepAtlas</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Free access to forums, tools, and the community
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
          <RegisterForm />
          <p className="text-center text-sm text-gray-500 pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-pink-400 hover:text-pink-300">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
