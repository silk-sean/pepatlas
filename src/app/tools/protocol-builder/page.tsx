import type { Metadata } from "next";
import { ProtocolBuilder } from "@/components/tools/ProtocolBuilder";

export const metadata: Metadata = {
  title: "Peptide Protocol Builder",
  description:
    "Build a personalized peptide protocol based on your research goals, experience level, and budget. Free tool with compound suggestions and weekly schedules.",
};

export default function ProtocolBuilderPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Peptide Protocol Builder
        </h1>
        <p className="mt-2 text-gray-600">
          Select your research goals and get a personalized protocol suggestion
          with compound recommendations, weekly scheduling, and cost estimates.
        </p>
      </div>
      <ProtocolBuilder />
    </div>
  );
}
