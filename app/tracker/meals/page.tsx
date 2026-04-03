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
  CardHeader,
  CardTitle,
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
  getMealsForDate,
  createMeal,
  deleteMeal,
  addDish,
  deleteDish,
} from "@/lib/tracker/store";
import { MEAL_TYPES } from "@/lib/tracker/types";
import type { Meal, Dish } from "@/lib/tracker/types";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function MealsPage() {
  const { user } = useAuth();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMealDialog, setShowMealDialog] = useState(false);
  const [showDishDialog, setShowDishDialog] = useState(false);
  const [activeMealId, setActiveMealId] = useState<string | null>(null);
  const [expandedMeals, setExpandedMeals] = useState<Set<string>>(new Set());

  // Meal form
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState<string>("breakfast");

  // Dish form
  const [dishName, setDishName] = useState("");
  const [dishCalories, setDishCalories] = useState("");
  const [dishProtein, setDishProtein] = useState("");
  const [dishCarbs, setDishCarbs] = useState("");
  const [dishFat, setDishFat] = useState("");
  const [dishFiber, setDishFiber] = useState("");
  const [dishSugar, setDishSugar] = useState("");
  const [dishSodium, setDishSodium] = useState("");
  const [dishServing, setDishServing] = useState("");

  const loadMeals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getMealsForDate(user.id, date);
      setMeals(data);
      // Auto-expand all meals
      setExpandedMeals(new Set(data.map((m) => m.id)));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user, date]);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  function resetMealForm() {
    setMealName("");
    setMealType("breakfast");
  }

  function resetDishForm() {
    setDishName("");
    setDishCalories("");
    setDishProtein("");
    setDishCarbs("");
    setDishFat("");
    setDishFiber("");
    setDishSugar("");
    setDishSodium("");
    setDishServing("");
  }

  async function handleCreateMeal(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    try {
      await createMeal({
        user_id: user.id,
        name: mealName,
        meal_type: mealType as Meal["meal_type"],
        date,
      });
      setShowMealDialog(false);
      resetMealForm();
      loadMeals();
    } catch {
      // ignore
    }
  }

  async function handleAddDish(e: React.FormEvent) {
    e.preventDefault();
    if (!activeMealId) return;
    try {
      await addDish({
        meal_id: activeMealId,
        name: dishName,
        calories: parseFloat(dishCalories) || 0,
        protein: parseFloat(dishProtein) || 0,
        carbs: parseFloat(dishCarbs) || 0,
        fat: parseFloat(dishFat) || 0,
        fiber: parseFloat(dishFiber) || 0,
        sugar: parseFloat(dishSugar) || 0,
        sodium: parseFloat(dishSodium) || 0,
        serving_size: dishServing,
      });
      setShowDishDialog(false);
      resetDishForm();
      loadMeals();
    } catch {
      // ignore
    }
  }

  async function handleDeleteMeal(mealId: string) {
    try {
      await deleteMeal(mealId);
      loadMeals();
    } catch {
      // ignore
    }
  }

  async function handleDeleteDish(dishId: string) {
    try {
      await deleteDish(dishId);
      loadMeals();
    } catch {
      // ignore
    }
  }

  function toggleMeal(mealId: string) {
    setExpandedMeals((prev) => {
      const next = new Set(prev);
      if (next.has(mealId)) next.delete(mealId);
      else next.add(mealId);
      return next;
    });
  }

  function mealTotals(meal: Meal) {
    return (meal.dishes ?? []).reduce(
      (acc, d) => ({
        calories: acc.calories + d.calories,
        protein: acc.protein + d.protein,
        carbs: acc.carbs + d.carbs,
        fat: acc.fat + d.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  return (
    <TrackerShell>
      <header className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-lg font-bold">Meals</h1>
        <Button size="sm" onClick={() => setShowMealDialog(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Meal
        </Button>
      </header>

      <DateNav date={date} onDateChange={setDate} />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : meals.length === 0 ? (
        <div className="px-4 py-12 text-center text-muted-foreground">
          <p>No meals logged for this day.</p>
          <p className="text-sm mt-1">Tap &quot;Add Meal&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-3 px-4 pb-4">
          {meals.map((meal) => {
            const totals = mealTotals(meal);
            const isExpanded = expandedMeals.has(meal.id);
            return (
              <Card key={meal.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <button
                      className="flex items-center gap-2 text-left"
                      onClick={() => toggleMeal(meal.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <CardTitle className="text-sm">{meal.name}</CardTitle>
                        <span className="text-xs text-muted-foreground capitalize">
                          {meal.meal_type}
                        </span>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums">
                        {Math.round(totals.calories)} cal
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleDeleteMeal(meal.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  {/* Macro summary */}
                  <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                    <span>P: {Math.round(totals.protein)}g</span>
                    <span>C: {Math.round(totals.carbs)}g</span>
                    <span>F: {Math.round(totals.fat)}g</span>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    {(meal.dishes ?? []).length === 0 ? (
                      <p className="text-xs text-muted-foreground py-2">
                        No dishes yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {meal.dishes.map((dish: Dish) => (
                          <div
                            key={dish.id}
                            className="flex items-start justify-between rounded-md bg-muted/50 px-3 py-2"
                          >
                            <div>
                              <div className="text-sm font-medium">{dish.name}</div>
                              {dish.serving_size && (
                                <div className="text-xs text-muted-foreground">
                                  {dish.serving_size}
                                </div>
                              )}
                              <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                                <span>{dish.calories} cal</span>
                                <span>P:{dish.protein}g</span>
                                <span>C:{dish.carbs}g</span>
                                <span>F:{dish.fat}g</span>
                              </div>
                              {(dish.fiber > 0 || dish.sugar > 0 || dish.sodium > 0) && (
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                  {dish.fiber > 0 && <span>Fiber:{dish.fiber}g</span>}
                                  {dish.sugar > 0 && <span>Sugar:{dish.sugar}g</span>}
                                  {dish.sodium > 0 && (
                                    <span>Sodium:{dish.sodium}mg</span>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleDeleteDish(dish.id)}
                            >
                              <Trash2 className="h-3 w-3 text-muted-foreground" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => {
                        setActiveMealId(meal.id);
                        setShowDishDialog(true);
                      }}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Dish
                    </Button>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Meal Dialog */}
      <Dialog open={showMealDialog} onOpenChange={setShowMealDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Meal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateMeal} className="space-y-4">
            <div className="space-y-2">
              <Label>Meal Name</Label>
              <Input
                placeholder="e.g. Morning Oats"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Add Meal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Dish Dialog */}
      <Dialog open={showDishDialog} onOpenChange={setShowDishDialog}>
        <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Dish</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDish} className="space-y-3">
            <div className="space-y-2">
              <Label>Dish Name</Label>
              <Input
                placeholder="e.g. Grilled Chicken Breast"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Serving Size</Label>
              <Input
                placeholder="e.g. 200g, 1 cup"
                value={dishServing}
                onChange={(e) => setDishServing(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Calories</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={dishCalories}
                  onChange={(e) => setDishCalories(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Protein (g)</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={dishProtein}
                  onChange={(e) => setDishProtein(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Carbs (g)</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={dishCarbs}
                  onChange={(e) => setDishCarbs(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Fat (g)</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={dishFat}
                  onChange={(e) => setDishFat(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Fiber (g)</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={dishFiber}
                  onChange={(e) => setDishFiber(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sugar (g)</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={dishSugar}
                  onChange={(e) => setDishSugar(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Sodium (mg)</Label>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={dishSodium}
                onChange={(e) => setDishSodium(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Add Dish
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TrackerShell>
  );
}
