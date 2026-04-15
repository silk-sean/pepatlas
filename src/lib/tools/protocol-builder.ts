export type Goal =
  | "recovery"
  | "fat-loss"
  | "sleep"
  | "cognition"
  | "anti-aging"
  | "gut-health"
  | "muscle-growth"
  | "joint-support";

export type Experience = "beginner" | "intermediate" | "advanced";
export type Budget = "low" | "medium" | "high";

export interface ProtocolInput {
  goals: Goal[];
  experience: Experience;
  budget: Budget;
}

export interface CompoundSuggestion {
  name: string;
  slug: string;
  doseMcg: number;
  frequency: string;
  duration: string;
  rationale: string;
  pepperpediaUrl: string;
}

export interface DaySchedule {
  day: string;
  compounds: { name: string; dose: string; timing: string }[];
}

export interface ProtocolResult {
  title: string;
  compounds: CompoundSuggestion[];
  weeklySchedule: DaySchedule[];
  estimatedMonthlyCost: { low: number; high: number };
  notes: string[];
  disclaimer: string;
}

// Compound database for protocol generation
const COMPOUND_DB: Record<
  string,
  {
    name: string;
    slug: string;
    goals: Goal[];
    experienceMin: Experience;
    costTier: Budget;
    defaultDoseMcg: number;
    frequency: string;
    duration: string;
    monthlyEstimate: { low: number; high: number };
  }
> = {
  "bpc-157": {
    name: "BPC-157",
    slug: "bpc-157",
    goals: ["recovery", "gut-health", "joint-support"],
    experienceMin: "beginner",
    costTier: "low",
    defaultDoseMcg: 250,
    frequency: "2x daily",
    duration: "4-6 weeks",
    monthlyEstimate: { low: 30, high: 60 },
  },
  "tb-500": {
    name: "TB-500",
    slug: "tb-500",
    goals: ["recovery", "joint-support", "anti-aging"],
    experienceMin: "beginner",
    costTier: "medium",
    defaultDoseMcg: 2500,
    frequency: "2x weekly (loading), 1x weekly (maintenance)",
    duration: "6-8 weeks",
    monthlyEstimate: { low: 40, high: 90 },
  },
  ipamorelin: {
    name: "Ipamorelin",
    slug: "ipamorelin",
    goals: ["sleep", "anti-aging", "muscle-growth", "fat-loss"],
    experienceMin: "beginner",
    costTier: "medium",
    defaultDoseMcg: 200,
    frequency: "1-3x daily",
    duration: "8-12 weeks",
    monthlyEstimate: { low: 40, high: 80 },
  },
  "cjc-1295": {
    name: "CJC-1295 (no DAC)",
    slug: "cjc-1295",
    goals: ["sleep", "anti-aging", "muscle-growth", "fat-loss"],
    experienceMin: "intermediate",
    costTier: "medium",
    defaultDoseMcg: 100,
    frequency: "1-3x daily (paired with GHRP)",
    duration: "8-12 weeks",
    monthlyEstimate: { low: 35, high: 70 },
  },
  "ghk-cu": {
    name: "GHK-Cu",
    slug: "ghk-cu",
    goals: ["anti-aging", "recovery", "cognition"],
    experienceMin: "intermediate",
    costTier: "medium",
    defaultDoseMcg: 200,
    frequency: "1x daily",
    duration: "4-8 weeks",
    monthlyEstimate: { low: 30, high: 60 },
  },
  selank: {
    name: "Selank",
    slug: "selank",
    goals: ["cognition", "sleep"],
    experienceMin: "intermediate",
    costTier: "medium",
    defaultDoseMcg: 300,
    frequency: "2-3x daily",
    duration: "2-4 weeks",
    monthlyEstimate: { low: 25, high: 55 },
  },
  "aod-9604": {
    name: "AOD-9604",
    slug: "aod-9604",
    goals: ["fat-loss"],
    experienceMin: "intermediate",
    costTier: "medium",
    defaultDoseMcg: 300,
    frequency: "1x daily (fasted)",
    duration: "8-12 weeks",
    monthlyEstimate: { low: 40, high: 80 },
  },
  kpv: {
    name: "KPV",
    slug: "kpv",
    goals: ["gut-health"],
    experienceMin: "intermediate",
    costTier: "medium",
    defaultDoseMcg: 500,
    frequency: "1-2x daily",
    duration: "4-6 weeks",
    monthlyEstimate: { low: 30, high: 60 },
  },
};

const EXPERIENCE_ORDER: Record<Experience, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

const BUDGET_ORDER: Record<Budget, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export function buildProtocol(input: ProtocolInput): ProtocolResult {
  const { goals, experience, budget } = input;

  // Filter compounds based on goals, experience, and budget
  const eligible = Object.values(COMPOUND_DB).filter((compound) => {
    const hasMatchingGoal = compound.goals.some((g) => goals.includes(g));
    const meetsExperience =
      EXPERIENCE_ORDER[experience] >=
      EXPERIENCE_ORDER[compound.experienceMin];
    const meetsBudget =
      BUDGET_ORDER[budget] >= BUDGET_ORDER[compound.costTier];
    return hasMatchingGoal && meetsExperience && meetsBudget;
  });

  // Score and sort by relevance (more goal matches = higher score)
  const scored = eligible.map((compound) => {
    const goalMatches = compound.goals.filter((g) =>
      goals.includes(g)
    ).length;
    return { ...compound, score: goalMatches };
  });
  scored.sort((a, b) => b.score - a.score);

  // Limit based on experience
  const maxCompounds =
    experience === "beginner" ? 2 : experience === "intermediate" ? 3 : 4;
  const selected = scored.slice(0, maxCompounds);

  const compounds: CompoundSuggestion[] = selected.map((c) => ({
    name: c.name,
    slug: c.slug,
    doseMcg: c.defaultDoseMcg,
    frequency: c.frequency,
    duration: c.duration,
    rationale: `Supports: ${c.goals.filter((g) => goals.includes(g)).join(", ")}`,
    pepperpediaUrl: `https://pepperpedia.net/wiki/${c.slug}`,
  }));

  // Build weekly schedule
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const weeklySchedule: DaySchedule[] = days.map((day) => ({
    day,
    compounds: selected
      .filter((c) => {
        // Daily compounds appear every day
        if (c.frequency.includes("daily")) return true;
        // Weekly compounds appear on specific days
        if (c.frequency.includes("weekly")) {
          if (c.frequency.includes("2x")) {
            return day === "Monday" || day === "Thursday";
          }
          return day === "Monday";
        }
        return true;
      })
      .map((c) => ({
        name: c.name,
        dose: `${c.defaultDoseMcg} mcg`,
        timing: c.frequency.includes("fasted")
          ? "Morning, fasted"
          : c.frequency.includes("before bed")
            ? "Before bed"
            : "Morning or evening",
      })),
  }));

  // Cost estimate
  const totalLow = selected.reduce(
    (sum, c) => sum + c.monthlyEstimate.low,
    0
  );
  const totalHigh = selected.reduce(
    (sum, c) => sum + c.monthlyEstimate.high,
    0
  );

  const notes: string[] = [];
  if (experience === "beginner") {
    notes.push(
      "Start with the lowest effective dose and assess tolerance before increasing."
    );
    notes.push(
      "Consider starting one compound at a time to isolate effects."
    );
  }
  if (goals.includes("sleep")) {
    notes.push(
      "Growth hormone secretagogues are typically administered before bed or upon waking."
    );
  }
  if (goals.includes("gut-health")) {
    notes.push(
      "Oral administration of BPC-157 may be considered for GI-specific applications."
    );
  }

  return {
    title: `${experience.charAt(0).toUpperCase() + experience.slice(1)} ${goals.join(" + ")} Protocol`,
    compounds,
    weeklySchedule,
    estimatedMonthlyCost: { low: totalLow, high: totalHigh },
    notes,
    disclaimer:
      "This protocol is generated for educational and research purposes only. It is not medical advice. Consult a qualified healthcare professional before beginning any new protocol.",
  };
}

export const AVAILABLE_GOALS: { value: Goal; label: string }[] = [
  { value: "recovery", label: "Recovery & Healing" },
  { value: "fat-loss", label: "Fat Loss" },
  { value: "sleep", label: "Sleep & Recovery" },
  { value: "cognition", label: "Cognition & Focus" },
  { value: "anti-aging", label: "Anti-Aging & Longevity" },
  { value: "gut-health", label: "Gut Health" },
  { value: "muscle-growth", label: "Muscle Growth" },
  { value: "joint-support", label: "Joint & Connective Tissue" },
];
