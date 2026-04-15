export interface CostCompoundInput {
  name: string;
  doseMcgPerDay: number;
  daysPerWeek: number;
  weeks: number;
  vialSizeMg: number;
  pricePerVial: number;
}

export interface CostCompoundResult {
  name: string;
  totalDoseMcg: number;
  totalVialsNeeded: number;
  totalCost: number;
}

export interface CostCalcResult {
  compounds: CostCompoundResult[];
  totalCost: number;
  costPerWeek: number;
  costPerDay: number;
  totalWeeks: number;
}

export function calculateCost(compounds: CostCompoundInput[]): CostCalcResult {
  const maxWeeks = Math.max(...compounds.map((c) => c.weeks), 1);

  const results: CostCompoundResult[] = compounds.map((compound) => {
    const totalDoses = compound.daysPerWeek * compound.weeks;
    const totalDoseMcg = compound.doseMcgPerDay * totalDoses;
    const mcgPerVial = compound.vialSizeMg * 1000;
    const totalVialsNeeded = Math.ceil(totalDoseMcg / mcgPerVial);
    const totalCost = totalVialsNeeded * compound.pricePerVial;

    return {
      name: compound.name,
      totalDoseMcg,
      totalVialsNeeded,
      totalCost: Math.round(totalCost * 100) / 100,
    };
  });

  const totalCost = results.reduce((sum, r) => sum + r.totalCost, 0);
  const totalDays = compounds.reduce(
    (sum, c) => sum + c.daysPerWeek * c.weeks,
    0
  );
  const costPerWeek = totalCost / maxWeeks;
  const costPerDay = totalDays > 0 ? totalCost / totalDays : 0;

  return {
    compounds: results,
    totalCost: Math.round(totalCost * 100) / 100,
    costPerWeek: Math.round(costPerWeek * 100) / 100,
    costPerDay: Math.round(costPerDay * 100) / 100,
    totalWeeks: maxWeeks,
  };
}
