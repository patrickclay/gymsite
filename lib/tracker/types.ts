export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  calorie_target: number;
  protein_target: number;
  carbs_target: number;
  fat_target: number;
  is_admin: boolean;
  created_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  name: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
  created_at: string;
  dishes: Dish[];
}

export interface Dish {
  id: string;
  meal_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  serving_size: string;
  created_at: string;
}

export interface ExerciseEntry {
  id: string;
  user_id: string;
  name: string;
  exercise_type: "cardio" | "strength" | "flexibility" | "sports" | "other";
  duration_minutes: number;
  calories_burned: number;
  notes: string;
  date: string;
  created_at: string;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  exercise_calories: number;
}

export const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
] as const;

export const EXERCISE_TYPES = [
  { value: "cardio", label: "Cardio" },
  { value: "strength", label: "Strength" },
  { value: "flexibility", label: "Flexibility" },
  { value: "sports", label: "Sports" },
  { value: "other", label: "Other" },
] as const;

export const DEFAULT_TARGETS = {
  calorie_target: 2000,
  protein_target: 150,
  carbs_target: 250,
  fat_target: 65,
};

// Admin emails — these users can view all students' data
export const ADMIN_EMAILS = [
  "pboggs2006@gmail.com",
];

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
