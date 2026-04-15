import Link from "next/link";
import type { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { pepcalcUrl } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Free Peptide Tools",
  description:
    "Free peptide research tools: Peppercalc dose calculator, protocol builder, cost calculator, and cycle planner.",
};

const TOOLS = [
  {
    name: "Peppercalc Dose Calculator",
    description:
      "Calculate exact injection volumes based on vial size, bacteriostatic water added, and desired dose. Supports all common peptides with preset values. Hosted at peppercalc.com.",
    href: pepcalcUrl("", "tools-index"),
    badge: "Most Popular",
    external: true,
  },
  {
    name: "Protocol Builder",
    description:
      "Get personalized protocol suggestions based on your research goals, experience level, and monthly budget. Includes weekly schedule and cost estimates.",
    href: "/tools/protocol-builder",
    badge: null,
  },
  {
    name: "Cost Calculator",
    description:
      "Estimate the total cost of your protocol. Add multiple compounds, set dosing parameters, and get per-day/per-week/total breakdowns.",
    href: "/tools/cost-calculator",
    badge: null,
  },
  {
    name: "Cycle Planner",
    description:
      "Plan multi-week cycles with start/stop dates, loading and maintenance phases, and PCT considerations. Coming soon.",
    href: "/tools/cycle-planner",
    badge: "Coming Soon",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Free Tools</h1>
      <p className="mt-2 text-lg text-gray-600">
        Research-grade calculators and planners for the peptide community.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {TOOLS.map((tool) => {
          const card = (
            <Card className="h-full hover:border-blue-300 transition-colors relative">
              {tool.badge && (
                <span className="absolute top-3 right-3 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {tool.badge}
                </span>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
            </Card>
          );
          if (tool.external) {
            return (
              <a key={tool.href} href={tool.href} target="_blank" rel="noopener noreferrer">
                {card}
              </a>
            );
          }
          return (
            <Link key={tool.href} href={tool.href}>
              {card}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
