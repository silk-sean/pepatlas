import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Cycle Planner — Coming Soon",
  description: "Plan multi-week peptide cycles with loading, maintenance, and PCT phases.",
};

export default function CyclePlannerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Cycle Planner</h1>
        <p className="mt-2 text-gray-600">Coming Soon</p>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Under Development</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-3">
          <p>The Cycle Planner will allow you to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Plan multi-week cycles with start and end dates</li>
            <li>Define loading, maintenance, and tapering phases</li>
            <li>Set compound-specific scheduling</li>
            <li>Export your plan as a printable calendar</li>
            <li>Save and share cycles with the community</li>
          </ul>
          <p className="text-gray-400 mt-4">
            In the meantime, try the{" "}
            <a href="/tools/protocol-builder" className="text-blue-600 hover:text-blue-800">
              Protocol Builder
            </a>{" "}
            for protocol suggestions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
