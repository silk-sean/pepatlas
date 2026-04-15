import type { Metadata } from "next";
import { CostCalculator } from "@/components/tools/CostCalculator";

export const metadata: Metadata = {
  title: "Peptide Cost Calculator",
  description:
    "Estimate the total cost of your peptide protocol. Add compounds, set dosing parameters, and get per-day, per-week, and total cost breakdowns.",
};

export default function CostCalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Peptide Cost Calculator
        </h1>
        <p className="mt-2 text-gray-600">
          Estimate the total cost of your protocol. Add multiple compounds, set
          dosing and duration, and enter pricing to get a full cost breakdown.
        </p>
      </div>
      <CostCalculator />
    </div>
  );
}
