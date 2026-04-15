"use client";

import { useState } from "react";
import { calculateDose, PEPTIDE_PRESETS } from "@/lib/tools/dose-calc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SupplierBadge } from "@/components/shared/SupplierBadge";
import { PepperpediaLink } from "@/components/shared/PepperpediaLink";

export function DoseCalculator() {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [peptideWeight, setPeptideWeight] = useState<string>("5");
  const [bacWater, setBacWater] = useState<string>("2");
  const [desiredDose, setDesiredDose] = useState<string>("250");

  const preset = PEPTIDE_PRESETS.find((p) => p.name === selectedPreset);

  const weight = parseFloat(peptideWeight) || 0;
  const water = parseFloat(bacWater) || 0;
  const dose = parseFloat(desiredDose) || 0;

  const canCalculate = weight > 0 && water > 0 && dose > 0;

  const result = canCalculate
    ? calculateDose({
        peptideWeightMg: weight,
        bacteriostaticWaterMl: water,
        desiredDoseMcg: dose,
      })
    : null;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* Peptide Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Peptide</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedPreset}
              onValueChange={(val) => {
                setSelectedPreset(val ?? "");
                const p = PEPTIDE_PRESETS.find((x) => x.name === val);
                if (p && p.commonVialSizes.length > 0) {
                  setPeptideWeight(String(p.commonVialSizes[0]));
                }
                if (p && p.commonDoses.length > 0) {
                  setDesiredDose(String(p.commonDoses[0]));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a peptide or enter custom values" />
              </SelectTrigger>
              <SelectContent>
                {PEPTIDE_PRESETS.map((p) => (
                  <SelectItem key={p.name} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {preset && preset.name !== "Custom" && (
              <div className="mt-3">
                <PepperpediaLink
                  slug={preset.name.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")}
                  label={`Learn about ${preset.name} on Pepperpedia`}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Input Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="peptideWeight">Peptide in Vial (mg)</Label>
                <Input
                  id="peptideWeight"
                  type="number"
                  step="0.5"
                  min="0"
                  value={peptideWeight}
                  onChange={(e) => setPeptideWeight(e.target.value)}
                  className="mt-1"
                />
                {preset &&
                  preset.commonVialSizes.length > 0 && (
                    <div className="mt-2 flex gap-1.5">
                      {preset.commonVialSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setPeptideWeight(String(size))}
                          className={`rounded px-2 py-0.5 text-xs transition-colors ${
                            peptideWeight === String(size)
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {size} mg
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              <div>
                <Label htmlFor="bacWater">BAC Water Added (mL)</Label>
                <Input
                  id="bacWater"
                  type="number"
                  step="0.5"
                  min="0"
                  value={bacWater}
                  onChange={(e) => setBacWater(e.target.value)}
                  className="mt-1"
                />
                <div className="mt-2 flex gap-1.5">
                  {[1, 1.5, 2, 2.5, 3, 5].map((vol) => (
                    <button
                      key={vol}
                      onClick={() => setBacWater(String(vol))}
                      className={`rounded px-2 py-0.5 text-xs transition-colors ${
                        bacWater === String(vol)
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {vol} mL
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="desiredDose">Desired Dose (mcg)</Label>
                <Input
                  id="desiredDose"
                  type="number"
                  step="25"
                  min="0"
                  value={desiredDose}
                  onChange={(e) => setDesiredDose(e.target.value)}
                  className="mt-1"
                />
                {preset &&
                  preset.commonDoses.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {preset.commonDoses.map((d) => (
                        <button
                          key={d}
                          onClick={() => setDesiredDose(String(d))}
                          className={`rounded px-2 py-0.5 text-xs transition-colors ${
                            desiredDose === String(d)
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {d} mcg
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">
                Calculation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-4 border border-blue-100">
                  <p className="text-sm text-gray-500">Concentration</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    {result.concentrationMcgPerMl.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">mcg/mL</p>
                </div>

                <div className="rounded-lg bg-white p-4 border border-blue-100">
                  <p className="text-sm text-gray-500">Volume to Inject</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    {result.volumeToInjectMl}
                  </p>
                  <p className="text-xs text-gray-500">mL</p>
                </div>

                <div className="rounded-lg bg-white p-4 border border-blue-100">
                  <p className="text-sm text-gray-500">
                    Insulin Syringe Units
                  </p>
                  <p className="text-2xl font-bold text-blue-600 font-mono">
                    {result.insulinSyringeUnits}
                  </p>
                  <p className="text-xs text-gray-500">units (U-100)</p>
                </div>

                <div className="rounded-lg bg-white p-4 border border-blue-100">
                  <p className="text-sm text-gray-500">Doses Per Vial</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    {result.dosesPerVial}
                  </p>
                  <p className="text-xs text-gray-500">
                    at {dose} mcg per dose
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-md bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs text-amber-800">
                  This calculator is for educational and research purposes only.
                  Always verify calculations independently before use. Consult a
                  qualified healthcare professional.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <SupplierBadge />

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Concentration</strong> = Peptide (mg) × 1000 ÷ Water (mL)
            </p>
            <p>
              <strong>Volume</strong> = Desired Dose (mcg) ÷ Concentration
            </p>
            <p>
              <strong>Syringe Units</strong> = Volume (mL) × 100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Related Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <PepperpediaLink slug="reconstitution" label="Reconstitution Guide" />
            <br />
            <PepperpediaLink
              slug="subcutaneous-injection"
              label="Injection Technique"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
