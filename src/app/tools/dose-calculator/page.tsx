import type { Metadata } from "next";
import { DoseCalculator } from "@/components/tools/DoseCalculator";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Peptide Dose Calculator",
  description:
    "Free peptide dose calculator. Calculate exact injection volumes based on vial size, bacteriostatic water, and desired dose in mcg. Supports BPC-157, TB-500, Ipamorelin, and more.",
  alternates: { canonical: `${SITE_URL}/tools/dose-calculator` },
};

export default function DoseCalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Peptide Dose Calculator
        </h1>
        <p className="mt-2 text-gray-600">
          Calculate the exact volume to draw for your desired peptide dose.
          Select a peptide preset or enter custom values.
        </p>
      </div>
      <DoseCalculator />
    </div>
  );
}
