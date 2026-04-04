"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface SearchSuggestion {
  food_name: string;
  brand_name?: string;
  serving_unit: string;
  serving_qty: number;
  source: "common" | "branded";
}

interface FoodSearchProps {
  onSelect: (result: NutritionResult) => void;
}

export function FoodSearch({ onSelect }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced instant search for suggestions
  const searchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, endpoint: "search" }),
      });
      const data = await res.json();
      if (data.results) {
        setSuggestions(data.results);
        setShowSuggestions(true);
      }
    } catch {
      // ignore search errors
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchSuggestions(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchSuggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Look up full nutrition for a food item
  async function lookupFood(foodName: string) {
    setLookingUp(true);
    setError("");
    setShowSuggestions(false);
    try {
      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: foodName }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      if (data.foods && data.foods.length > 0) {
        onSelect(data.foods[0]);
        setQuery("");
        setSuggestions([]);
      } else {
        setError("No nutrition data found");
      }
    } catch {
      setError("Failed to look up nutrition data");
    } finally {
      setLookingUp(false);
    }
  }

  // Handle "Enter" to do a direct natural language lookup
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      lookupFood(query.trim());
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder='Search food, e.g. "chicken breast 200g"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="pl-8 text-sm"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={!query.trim() || lookingUp}
        >
          {lookingUp ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Look up"
          )}
        </Button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-y-auto">
          {suggestions.map((item, i) => (
            <button
              key={`${item.food_name}-${item.source}-${i}`}
              type="button"
              className={cn(
                "flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-muted/50",
                i < suggestions.length - 1 && "border-b"
              )}
              onClick={() => {
                const label =
                  item.source === "branded" && item.brand_name
                    ? `${item.food_name} (${item.brand_name})`
                    : item.food_name;
                lookupFood(label);
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate capitalize">
                  {item.food_name}
                </div>
                {item.brand_name && (
                  <div className="text-xs text-muted-foreground truncate">
                    {item.brand_name}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {item.serving_qty} {item.serving_unit}
                </div>
              </div>
              <span className="text-xs text-muted-foreground capitalize shrink-0">
                {item.source}
              </span>
            </button>
          ))}
        </div>
      )}

      {searching && (
        <div className="absolute right-16 top-1/2 -translate-y-1/2">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
