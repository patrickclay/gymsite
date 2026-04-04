"use client";

import { createBrowserClient } from "@/lib/supabase/client";
import type {
  Meal,
  Dish,
  ExerciseEntry,
  UserProfile,
  DailyTotals,
} from "./types";

const supabase = () => createBrowserClient();

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function signUp(email: string, password: string, displayName: string) {
  const { data, error } = await supabase().auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase().auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/tracker/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase().auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data } = await supabase().auth.getSession();
  return data.session;
}

export function onAuthChange(cb: (session: unknown) => void) {
  return supabase().auth.onAuthStateChange((_event, session) => cb(session));
}

// ── Profile ───────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data } = await supabase()
    .from("tracker_profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function upsertProfile(profile: Partial<UserProfile> & { id: string }) {
  const { data, error } = await supabase()
    .from("tracker_profiles")
    .upsert(profile as never, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data as UserProfile;
}

// ── Meals ─────────────────────────────────────────────────────────────────────

export async function getMealsForDate(userId: string, date: string): Promise<Meal[]> {
  const { data, error } = await supabase()
    .from("tracker_meals")
    .select("*, dishes:tracker_dishes(*)")
    .eq("user_id", userId)
    .eq("date", date)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Meal[];
}

export async function createMeal(
  meal: Omit<Meal, "id" | "created_at" | "dishes">
): Promise<Meal> {
  const { data, error } = await supabase()
    .from("tracker_meals")
    .insert(meal as never)
    .select("*, dishes:tracker_dishes(*)")
    .single();
  if (error) throw error;
  return data as Meal;
}

export async function deleteMeal(mealId: string) {
  const { error } = await supabase().from("tracker_meals").delete().eq("id", mealId);
  if (error) throw error;
}

// ── Dishes ────────────────────────────────────────────────────────────────────

export async function addDish(dish: Omit<Dish, "id" | "created_at">): Promise<Dish> {
  const { data, error } = await supabase()
    .from("tracker_dishes")
    .insert(dish as never)
    .select()
    .single();
  if (error) throw error;
  return data as Dish;
}

export async function updateDish(id: string, updates: Partial<Dish>) {
  const { data, error } = await supabase()
    .from("tracker_dishes")
    .update(updates as never)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Dish;
}

export async function deleteDish(dishId: string) {
  const { error } = await supabase().from("tracker_dishes").delete().eq("id", dishId);
  if (error) throw error;
}

// ── Exercise ──────────────────────────────────────────────────────────────────

export async function getExercisesForDate(
  userId: string,
  date: string
): Promise<ExerciseEntry[]> {
  const { data, error } = await supabase()
    .from("tracker_exercises")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ExerciseEntry[];
}

export async function createExercise(
  entry: Omit<ExerciseEntry, "id" | "created_at">
): Promise<ExerciseEntry> {
  const { data, error } = await supabase()
    .from("tracker_exercises")
    .insert(entry as never)
    .select()
    .single();
  if (error) throw error;
  return data as ExerciseEntry;
}

export async function deleteExercise(exerciseId: string) {
  const { error } = await supabase()
    .from("tracker_exercises")
    .delete()
    .eq("id", exerciseId);
  if (error) throw error;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function getAllProfiles(): Promise<UserProfile[]> {
  const { data, error } = await supabase()
    .from("tracker_profiles")
    .select("*")
    .order("display_name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as UserProfile[];
}

export async function getMealsForUser(userId: string, date: string): Promise<Meal[]> {
  return getMealsForDate(userId, date);
}

export async function getExercisesForUser(userId: string, date: string): Promise<ExerciseEntry[]> {
  return getExercisesForDate(userId, date);
}

// ── Computed ──────────────────────────────────────────────────────────────────

export function computeDailyTotals(
  meals: Meal[],
  exercises: ExerciseEntry[]
): DailyTotals {
  const totals: DailyTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    exercise_calories: 0,
  };

  for (const meal of meals) {
    for (const dish of meal.dishes ?? []) {
      totals.calories += dish.calories;
      totals.protein += dish.protein;
      totals.carbs += dish.carbs;
      totals.fat += dish.fat;
      totals.fiber += dish.fiber;
      totals.sugar += dish.sugar;
      totals.sodium += dish.sodium;
    }
  }

  for (const ex of exercises) {
    totals.exercise_calories += ex.calories_burned;
  }

  return totals;
}
