"use client";

import { useState } from "react";
import {
  buildProtocol,
  AVAILABLE_GOALS,
  type Goal,
  type Experience,
  type Budget,
  type ProtocolResult,
} from "@/lib/tools/protocol-builder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { SupplierBadge } from "@/components/shared/SupplierBadge";
import { SourceCTA } from "@/components/shared/SourceCTA";
import { PepperpediaLink } from "@/components/shared/PepperpediaLink";

export function ProtocolBuilder() {
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const [experience, setExperience] = useState<Experience>("beginner");
  const [budget, setBudget] = useState<Budget>("medium");
  const [result, setResult] = useState<ProtocolResult | null>(null);

  const toggleGoal = (goal: Goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
    setResult(null);
  };

  const handleBuild = () => {
    if (selectedGoals.length === 0) return;
    const protocol = buildProtocol({
      goals: selectedGoals,
      experience,
      budget,
    });
    setResult(protocol);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              What are your research goals?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_GOALS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleGoal(value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedGoals.includes(value)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience & Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Experience Level</Label>
              <Select
                value={experience}
                onValueChange={(v) => {
                  setExperience(v as Experience);
                  setResult(null);
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">
                    Beginner (first time)
                  </SelectItem>
                  <SelectItem value="intermediate">
                    Intermediate (some experience)
                  </SelectItem>
                  <SelectItem value="advanced">
                    Advanced (well experienced)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Monthly Budget</Label>
              <Select
                value={budget}
                onValueChange={(v) => {
                  setBudget(v as Budget);
                  setResult(null);
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (&lt; $50/mo)</SelectItem>
                  <SelectItem value="medium">Medium ($50–150/mo)</SelectItem>
                  <SelectItem value="high">High ($150+/mo)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleBuild}
          disabled={selectedGoals.length === 0}
          className="w-full"
          size="lg"
        >
          Build Protocol
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">
                  {result.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Suggested Compounds */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Suggested Compounds
                  </h3>
                  <div className="space-y-3">
                    {result.compounds.map((compound) => (
                      <div
                        key={compound.slug}
                        className="rounded-lg border border-gray-200 bg-white p-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {compound.name}
                          </h4>
                          <Badge variant="secondary">
                            {compound.doseMcg} mcg
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {compound.frequency} for {compound.duration}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {compound.rationale}
                        </p>
                        <div className="mt-2">
                          <PepperpediaLink
                            slug={compound.slug}
                            label={`Learn about ${compound.name}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Schedule */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Weekly Schedule
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 pr-4 text-gray-500 font-medium">
                            Day
                          </th>
                          <th className="text-left py-2 text-gray-500 font-medium">
                            Compounds
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.weeklySchedule.map((day) => (
                          <tr
                            key={day.day}
                            className="border-b border-gray-100"
                          >
                            <td className="py-2 pr-4 font-medium text-gray-900">
                              {day.day}
                            </td>
                            <td className="py-2">
                              {day.compounds.length === 0 ? (
                                <span className="text-gray-400">Rest day</span>
                              ) : (
                                <div className="space-y-1">
                                  {day.compounds.map((c, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-2"
                                    >
                                      <span className="text-gray-900">
                                        {c.name}
                                      </span>
                                      <span className="text-gray-500">
                                        {c.dose}
                                      </span>
                                      <span className="text-gray-400 text-xs">
                                        ({c.timing})
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cost Estimate */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Estimated Monthly Cost
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    ${result.estimatedMonthlyCost.low} – $
                    {result.estimatedMonthlyCost.high}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Varies by supplier and quantity
                  </p>
                </div>

                {/* Notes */}
                {result.notes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Notes
                    </h3>
                    <ul className="space-y-1">
                      {result.notes.map((note, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-600 flex items-start gap-2"
                        >
                          <span className="text-blue-500 mt-1">•</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                  <p className="text-xs text-amber-800">
                    {result.disclaimer}
                  </p>
                </div>

                {/* Source CTA */}
                <SourceCTA />
              </CardContent>
            </Card>
          </div>
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
            <p>1. Select your research goals</p>
            <p>2. Set your experience level and budget</p>
            <p>3. Get a personalized protocol suggestion</p>
            <p className="text-xs text-gray-400 mt-3">
              Protocols are generated based on published research and community
              knowledge. They are educational suggestions, not prescriptions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
