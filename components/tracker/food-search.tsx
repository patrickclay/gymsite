"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

export interface NutritionResult {
  name: string;
  serving_size: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

interface FoodSearchProps {
  onSelect: (result: NutritionResult) => void;
}

export function FoodSearch({ onSelect }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NutritionResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      if (data.foods && data.foods.length > 0) {
        setResults(data.foods);
        setShowResults(true);
      } else {
        setError("No nutrition data found");
      }
    } catch {
      setError("Failed to look up nutrition data");
    } finally {
      setLoading(false);
    }
  }

  function selectFood(food: NutritionResult) {
    onSelect(food);
    setQuery("");
    setResults([]);
    setShowResults(false);
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder='e.g. "200g chicken breast"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 text-sm"
          />
        </div>
        <Button type="submit" size="sm" disabled={!query.trim() || loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Look up"}
        </Button>
      </form>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-y-auto">
          {results.map((food, i) => (
            <button
              key={`${food.name}-${i}`}
              type="button"
              className="flex w-full items-start justify-between px-3 py-2 text-left text-sm hover:bg-muted/50 border-b last:border-b-0"
              onClick={() => selectFood(food)}
            >
              <div className="min-w-0">
                <div className="font-medium capitalize">{food.name}</div>
                <div className="text-xs text-muted-foreground">
                  {food.serving_size}
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-right shrink-0 ml-2">
                <div>{food.calories} cal</div>
                <div>P:{food.protein}g C:{food.carbs}g F:{food.fat}g</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
