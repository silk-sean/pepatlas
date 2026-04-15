import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
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
          <RegisterForm />
          <p className="text-center text-sm text-gray-500 pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
