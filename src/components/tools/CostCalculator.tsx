"use client";

import { useState } from "react";
import {
  calculateCost,
  type CostCompoundInput,
  type CostCalcResult,
} from "@/lib/tools/cost-calc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplierBadge } from "@/components/shared/SupplierBadge";
import { SUPPLIER_URL, SUPPLIER_NAME } from "@/lib/constants";

const emptyCompound: CostCompoundInput = {
  name: "",
  doseMcgPerDay: 250,
  daysPerWeek: 7,
  weeks: 4,
  vialSizeMg: 5,
  pricePerVial: 30,
};

export function CostCalculator() {
  const [compounds, setCompounds] = useState<CostCompoundInput[]>([
    { ...emptyCompound, name: "BPC-157" },
  ]);
  const [result, setResult] = useState<CostCalcResult | null>(null);

  const updateCompound = (
    index: number,
    field: keyof CostCompoundInput,
    value: string | number
  ) => {
    setCompounds((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
    setResult(null);
  };

  const addCompound = () => {
    setCompounds((prev) => [...prev, { ...emptyCompound }]);
    setResult(null);
  };

  const removeCompound = (index: number) => {
    setCompounds((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const handleCalculate = () => {
    const valid = compounds.filter((c) => c.name.trim() !== "");
    if (valid.length === 0) return;
    setResult(calculateCost(valid));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {compounds.map((compound, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Compound {index + 1}
                </CardTitle>
                {compounds.length > 1 && (
                  <button
                    onClick={() => removeCompound(index)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <Label>Compound Name</Label>
                <Input
                  value={compound.name}
                  onChange={(e) =>
                    updateCompound(index, "name", e.target.value)
                  }
                  placeholder="e.g., BPC-157"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Dose (mcg/day)</Label>
                <Input
                  type="number"
                  value={compound.doseMcgPerDay}
                  onChange={(e) =>
                    updateCompound(
                      index,
                      "doseMcgPerDay",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Days/Week</Label>
                <Input
                  type="number"
                  min="1"
                  max="7"
                  value={compound.daysPerWeek}
                  onChange={(e) =>
                    updateCompound(
                      index,
                      "daysPerWeek",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Weeks</Label>
                <Input
                  type="number"
                  min="1"
                  value={compound.weeks}
                  onChange={(e) =>
                    updateCompound(
                      index,
                      "weeks",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Vial Size (mg)</Label>
                <Input
                  type="number"
                  value={compound.vialSizeMg}
                  onChange={(e) =>
                    updateCompound(
                      index,
                      "vialSizeMg",
                      parseFloat(e.target.value) || 1
                    )
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Price/Vial ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={compound.pricePerVial}
                  onChange={(e) =>
                    updateCompound(
                      index,
                      "pricePerVial",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-3">
          <Button variant="outline" onClick={addCompound}>
            + Add Compound
          </Button>
          <Button onClick={handleCalculate} className="flex-1">
            Calculate Cost
          </Button>
        </div>

        {result && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.compounds.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-white p-3 border border-blue-100"
                >
                  <div>
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">
                      {c.totalVialsNeeded} vials needed
                    </p>
                  </div>
                  <p className="text-lg font-bold font-mono text-gray-900">
                    ${c.totalCost.toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="grid gap-4 sm:grid-cols-3 mt-4">
                <div className="rounded-lg bg-white p-4 border border-blue-100 text-center">
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    ${result.totalCost.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 border border-blue-100 text-center">
                  <p className="text-sm text-gray-500">Per Week</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    ${result.costPerWeek.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 border border-blue-100 text-center">
                  <p className="text-sm text-gray-500">Per Day</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    ${result.costPerDay.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-700">
                  These numbers are based on the price-per-vial you entered. Real-world
                  cost varies significantly by vendor, purity, and batch. Always request
                  a current Certificate of Analysis (COA) before purchasing any research
                  material.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <SupplierBadge />
      </div>
    </div>
  );
}
