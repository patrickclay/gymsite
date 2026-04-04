"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/tracker/auth-context";
import { TrackerShell } from "@/components/tracker/tracker-shell";
import { DateNav } from "@/components/tracker/date-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getExercisesForDate,
  createExercise,
  deleteExercise,
} from "@/lib/tracker/store";
import { EXERCISE_TYPES } from "@/lib/tracker/types";
import type { ExerciseEntry } from "@/lib/tracker/types";
import { Plus, Trash2, Clock, Flame, Loader2 } from "lucide-react";

export default function ExercisePage() {
  const { user } = useAuth();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [exerciseType, setExerciseType] = useState<string>("cardio");
  const [duration, setDuration] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [notes, setNotes] = useState("");
  const [estimating, setEstimating] = useState(false);

  const loadExercises = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getExercisesForDate(user.id, date);
      setExercises(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user, date]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  function resetForm() {
    setName("");
    setExerciseType("cardio");
    setDuration("");
    setCaloriesBurned("");
    setNotes("");
  }

  async function estimateCalories() {
    if (!name.trim()) return;
    setEstimating(true);
    try {
      const res = await fetch("/api/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity: name.trim(),
          duration_minutes: parseFloat(duration) || 30,
        }),
      });
      const data = await res.json();
      if (data.results?.length > 0) {
        setCaloriesBurned(String(Math.round(data.results[0].total_calories)));
      }
    } catch {
      // ignore - user can still enter manually
    } finally {
      setEstimating(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    try {
      await createExercise({
        user_id: user.id,
        name,
        exercise_type: exerciseType as ExerciseEntry["exercise_type"],
        duration_minutes: parseFloat(duration) || 0,
        calories_burned: parseFloat(caloriesBurned) || 0,
        notes,
        date,
      });
      setShowDialog(false);
      resetForm();
      loadExercises();
    } catch {
      // ignore
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteExercise(id);
      loadExercises();
    } catch {
      // ignore
    }
  }

  const totalBurned = exercises.reduce((sum, e) => sum + e.calories_burned, 0);
  const totalMinutes = exercises.reduce((sum, e) => sum + e.duration_minutes, 0);

  return (
    <TrackerShell>
      <header className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-lg font-bold">Exercise</h1>
        <Button size="sm" onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-1" /> Log Exercise
        </Button>
      </header>

      <DateNav date={date} onDateChange={setDate} />

      {/* Daily summary */}
      <div className="flex gap-3 px-4 mb-3">
        <Card className="flex-1">
          <CardContent className="flex items-center gap-2 py-3">
            <Flame className="h-4 w-4 text-orange-500" />
            <div>
              <div className="text-sm font-bold tabular-nums">
                {Math.round(totalBurned)}
              </div>
              <div className="text-xs text-muted-foreground">cal burned</div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="flex items-center gap-2 py-3">
            <Clock className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-sm font-bold tabular-nums">
                {Math.round(totalMinutes)}
              </div>
              <div className="text-xs text-muted-foreground">minutes</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : exercises.length === 0 ? (
        <div className="px-4 py-12 text-center text-muted-foreground">
          <p>No exercise logged for this day.</p>
          <p className="text-sm mt-1">
            Tap &quot;Log Exercise&quot; to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3 px-4 pb-4">
          {exercises.map((ex) => (
            <Card key={ex.id}>
              <CardContent className="py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sm">{ex.name}</div>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span className="capitalize">{ex.exercise_type}</span>
                      <span>{ex.duration_minutes} min</span>
                      <span>{ex.calories_burned} cal</span>
                    </div>
                    {ex.notes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {ex.notes}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleDelete(ex.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Exercise Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Log Exercise</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Exercise Name</Label>
              <Input
                placeholder="e.g. Running, Bench Press"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={exerciseType} onValueChange={setExerciseType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXERCISE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Duration (min)</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Calories Burned</Label>
                <div className="flex gap-1">
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs"
                    disabled={!name.trim() || estimating}
                    onClick={estimateCalories}
                  >
                    {estimating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Est."}
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Input
                placeholder="e.g. 3 sets of 10 reps"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Log Exercise
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TrackerShell>
  );
}
