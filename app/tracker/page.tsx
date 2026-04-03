"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/tracker/auth-context";
import { TrackerShell } from "@/components/tracker/tracker-shell";
import { DateNav } from "@/components/tracker/date-nav";
import { ProgressRing, MacroBar } from "@/components/tracker/progress-ring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getMealsForDate,
  getExercisesForDate,
  getProfile,
  computeDailyTotals,
} from "@/lib/tracker/store";
import { DEFAULT_TARGETS } from "@/lib/tracker/types";
import type { Meal, ExerciseEntry, UserProfile } from "@/lib/tracker/types";
import { Flame, Dumbbell, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [meals, setMeals] = useState<Meal[]>([]);
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [m, e, p] = await Promise.all([
        getMealsForDate(user.id, date),
        getExercisesForDate(user.id, date),
        getProfile(user.id),
      ]);
      setMeals(m);
      setExercises(e);
      setProfile(p);
    } catch {
      // fail silently on load
    } finally {
      setLoading(false);
    }
  }, [user, date]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const targets = {
    calorie_target: profile?.calorie_target ?? DEFAULT_TARGETS.calorie_target,
    protein_target: profile?.protein_target ?? DEFAULT_TARGETS.protein_target,
    carbs_target: profile?.carbs_target ?? DEFAULT_TARGETS.carbs_target,
    fat_target: profile?.fat_target ?? DEFAULT_TARGETS.fat_target,
  };

  const totals = computeDailyTotals(meals, exercises);
  const netCalories = totals.calories - totals.exercise_calories;

  return (
    <TrackerShell>
      <header className="px-4 pt-4">
        <h1 className="text-lg font-bold">Dashboard</h1>
      </header>

      <DateNav date={date} onDateChange={setDate} />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-4 px-4 pb-4">
          {/* Calorie Ring */}
          <Card>
            <CardContent className="flex flex-col items-center py-6">
              <ProgressRing
                value={netCalories}
                max={targets.calorie_target}
                size={140}
                strokeWidth={10}
                label="Net Calories"
              />
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <UtensilsCrossed className="h-3 w-3" />
                  {Math.round(totals.calories)} eaten
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  {Math.round(totals.exercise_calories)} burned
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Macros */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Macros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <MacroBar
                label="Protein"
                value={totals.protein}
                max={targets.protein_target}
                color="#3b82f6"
              />
              <MacroBar
                label="Carbs"
                value={totals.carbs}
                max={targets.carbs_target}
                color="#f59e0b"
              />
              <MacroBar
                label="Fat"
                value={totals.fat}
                max={targets.fat_target}
                color="#ef4444"
              />
            </CardContent>
          </Card>

          {/* Nutrients */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Other Nutrients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold tabular-nums">
                    {Math.round(totals.fiber)}g
                  </div>
                  <div className="text-xs text-muted-foreground">Fiber</div>
                </div>
                <div>
                  <div className="text-lg font-bold tabular-nums">
                    {Math.round(totals.sugar)}g
                  </div>
                  <div className="text-xs text-muted-foreground">Sugar</div>
                </div>
                <div>
                  <div className="text-lg font-bold tabular-nums">
                    {Math.round(totals.sodium)}mg
                  </div>
                  <div className="text-xs text-muted-foreground">Sodium</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/tracker/meals">
              <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardContent className="flex flex-col items-center gap-2 py-4">
                  <UtensilsCrossed className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">
                    {meals.length} Meal{meals.length !== 1 ? "s" : ""}
                  </span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tracker/exercise">
              <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardContent className="flex flex-col items-center gap-2 py-4">
                  <Dumbbell className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">
                    {exercises.length} Exercise{exercises.length !== 1 ? "s" : ""}
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}
    </TrackerShell>
  );
}
