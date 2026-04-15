export interface DoseCalcInput {
  peptideWeightMg: number;
  bacteriostaticWaterMl: number;
  desiredDoseMcg: number;
}

export interface DoseCalcResult {
  concentrationMcgPerMl: number;
  volumeToInjectMl: number;
  insulinSyringeUnits: number;
  dosesPerVial: number;
}

export function calculateDose(input: DoseCalcInput): DoseCalcResult {
  const { peptideWeightMg, bacteriostaticWaterMl, desiredDoseMcg } = input;

  // Convert mg to mcg and calculate concentration
  const concentrationMcgPerMl =
    (peptideWeightMg * 1000) / bacteriostaticWaterMl;

  // Volume needed for desired dose
  const volumeToInjectMl = desiredDoseMcg / concentrationMcgPerMl;

  // Convert mL to insulin syringe units (1 mL = 100 units on U-100 syringe)
  const insulinSyringeUnits = volumeToInjectMl * 100;

  // How many doses per vial
  const dosesPerVial = Math.floor(
    (peptideWeightMg * 1000) / desiredDoseMcg
  );

  return {
    concentrationMcgPerMl: Math.round(concentrationMcgPerMl * 100) / 100,
    volumeToInjectMl: Math.round(volumeToInjectMl * 10000) / 10000,
    insulinSyringeUnits: Math.round(insulinSyringeUnits * 100) / 100,
    dosesPerVial,
  };
}

// Preset peptide data for the calculator
export const PEPTIDE_PRESETS = [
  { name: "BPC-157", commonVialSizes: [5, 10], commonDoses: [250, 500, 750] },
  {
    name: "TB-500",
    commonVialSizes: [2, 5, 10],
    commonDoses: [2000, 2500, 5000],
  },
  { name: "Ipamorelin", commonVialSizes: [2, 5], commonDoses: [200, 300] },
  {
    name: "CJC-1295 (no DAC)",
    commonVialSizes: [2, 5],
    commonDoses: [100, 200],
  },
  { name: "GHK-Cu", commonVialSizes: [5, 10], commonDoses: [200, 500] },
  { name: "GHRP-6", commonVialSizes: [5, 10], commonDoses: [100, 200, 300] },
  { name: "GHRP-2", commonVialSizes: [5, 10], commonDoses: [100, 200, 300] },
  { name: "Sermorelin", commonVialSizes: [2, 5], commonDoses: [200, 300] },
  { name: "PT-141", commonVialSizes: [10], commonDoses: [1000, 1750, 2000] },
  { name: "AOD-9604", commonVialSizes: [5, 10], commonDoses: [250, 300] },
  { name: "Selank", commonVialSizes: [5], commonDoses: [250, 500] },
  { name: "Semax", commonVialSizes: [5], commonDoses: [200, 600] },
  {
    name: "KPV",
    commonVialSizes: [5, 10],
    commonDoses: [200, 500],
  },
  { name: "Custom", commonVialSizes: [], commonDoses: [] },
] as const;
