"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/tracker/auth-context";
import { TrackerShell } from "@/components/tracker/tracker-shell";
import { DateNav } from "@/components/tracker/date-nav";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MacroBar } from "@/components/tracker/progress-ring";
import {
  getAllProfiles,
  getMealsForUser,
  getExercisesForUser,
  computeDailyTotals,
} from "@/lib/tracker/store";
import { isAdminEmail, DEFAULT_TARGETS } from "@/lib/tracker/types";
import type { UserProfile, Meal, ExerciseEntry, DailyTotals } from "@/lib/tracker/types";
import { Users, ChevronDown, ChevronUp } from "lucide-react";

interface StudentData {
  profile: UserProfile;
  meals: Meal[];
  exercises: ExerciseEntry[];
  totals: DailyTotals;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && (!user || !isAdminEmail(user.email))) {
      router.replace("/tracker");
    }
  }, [user, authLoading, router]);

  const loadStudents = useCallback(async () => {
    if (!user || !isAdminEmail(user.email)) return;
    setLoading(true);
    try {
      const profiles = await getAllProfiles();
      const data: StudentData[] = await Promise.all(
        profiles.map(async (profile) => {
          const [meals, exercises] = await Promise.all([
            getMealsForUser(profile.id, date),
            getExercisesForUser(profile.id, date),
          ]);
          return {
            profile,
            meals,
            exercises,
            totals: computeDailyTotals(meals, exercises),
          };
        })
      );
      setStudents(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user, date]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  function toggleStudent(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (authLoading || !user || !isAdminEmail(user.email)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <TrackerShell>
      <header className="px-4 pt-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold">Student Overview</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          View all students&apos; nutrition and exercise for the day
        </p>
      </header>

      <DateNav date={date} onDateChange={setDate} />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : students.length === 0 ? (
        <div className="px-4 py-12 text-center text-muted-foreground">
          <p>No students have signed up yet.</p>
        </div>
      ) : (
        <div className="space-y-3 px-4 pb-4">
          {students.map(({ profile, meals, exercises, totals }) => {
            const isExpanded = expanded.has(profile.id);
            const target = profile.calorie_target || DEFAULT_TARGETS.calorie_target;
            const net = totals.calories - totals.exercise_calories;
            const pctCal = target > 0 ? Math.round((net / target) * 100) : 0;

            return (
              <Card key={profile.id}>
                <CardHeader className="pb-2">
                  <button
                    className="flex items-center justify-between w-full text-left"
                    onClick={() => toggleStudent(profile.id)}
                  >
                    <div>
                      <CardTitle className="text-sm">
                        {profile.display_name || profile.email}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">
                        {profile.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-semibold tabular-nums">
                          {Math.round(net)} / {target} cal
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {pctCal}%
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    {/* Macros */}
                    <div className="space-y-2">
                      <MacroBar
                        label="Protein"
                        value={totals.protein}
                        max={profile.protein_target || DEFAULT_TARGETS.protein_target}
                        color="#3b82f6"
                      />
                      <MacroBar
                        label="Carbs"
                        value={totals.carbs}
                        max={profile.carbs_target || DEFAULT_TARGETS.carbs_target}
                        color="#f59e0b"
                      />
                      <MacroBar
                        label="Fat"
                        value={totals.fat}
                        max={profile.fat_target || DEFAULT_TARGETS.fat_target}
                        color="#ef4444"
                      />
                    </div>

                    {/* Meals breakdown */}
                    {meals.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold mb-1">
                          Meals ({meals.length})
                        </h3>
                        <div className="space-y-1">
                          {meals.map((meal) => {
                            const mealCal = (meal.dishes ?? []).reduce(
                              (s, d) => s + d.calories,
                              0
                            );
                            return (
                              <div
                                key={meal.id}
                                className="flex justify-between text-xs bg-muted/50 rounded px-2 py-1"
                              >
                                <span>
                                  {meal.name}{" "}
                                  <span className="text-muted-foreground capitalize">
                                    ({meal.meal_type})
                                  </span>
                                </span>
                                <span className="tabular-nums font-medium">
                                  {Math.round(mealCal)} cal
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Exercise breakdown */}
                    {exercises.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold mb-1">
                          Exercise ({exercises.length})
                        </h3>
                        <div className="space-y-1">
                          {exercises.map((ex) => (
                            <div
                              key={ex.id}
                              className="flex justify-between text-xs bg-muted/50 rounded px-2 py-1"
                            >
                              <span>
                                {ex.name}{" "}
                                <span className="text-muted-foreground">
                                  {ex.duration_minutes}min
                                </span>
                              </span>
                              <span className="tabular-nums font-medium">
                                -{ex.calories_burned} cal
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {meals.length === 0 && exercises.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No activity logged for this day.
                      </p>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </TrackerShell>
  );
}
