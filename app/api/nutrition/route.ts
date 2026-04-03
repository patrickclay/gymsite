import { NextRequest, NextResponse } from "next/server";

const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_APP_KEY = process.env.NUTRITIONIX_APP_KEY;
const NUTRITIONIX_URL = "https://trackapi.nutritionix.com/v2";

export async function POST(req: NextRequest) {
  if (!NUTRITIONIX_APP_ID || !NUTRITIONIX_APP_KEY) {
    return NextResponse.json(
      { error: "Nutritionix API keys not configured" },
      { status: 500 }
    );
  }

  const { query, endpoint } = await req.json();

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const headers = {
    "Content-Type": "application/json",
    "x-app-id": NUTRITIONIX_APP_ID,
    "x-app-key": NUTRITIONIX_APP_KEY,
  };

  try {
    if (endpoint === "search") {
      // Instant search — returns food name suggestions
      const res = await fetch(
        `${NUTRITIONIX_URL}/search/instant?query=${encodeURIComponent(query)}`,
        { headers }
      );
      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json(
          { error: `Nutritionix error: ${res.status}`, detail: text },
          { status: res.status }
        );
      }
      const data = await res.json();

      // Combine common + branded results, limit to 10
      const results = [
        ...(data.common ?? []).map((item: Record<string, unknown>) => ({
          food_name: item.food_name,
          serving_unit: item.serving_unit,
          serving_qty: item.serving_qty,
          photo: (item.photo as Record<string, unknown>)?.thumb,
          source: "common" as const,
        })),
        ...(data.branded ?? []).map((item: Record<string, unknown>) => ({
          food_name: item.food_name,
          brand_name: item.brand_name,
          serving_unit: item.serving_unit,
          serving_qty: item.serving_qty,
          nf_calories: item.nf_calories,
          photo: (item.photo as Record<string, unknown>)?.thumb,
          source: "branded" as const,
          nix_item_id: item.nix_item_id,
        })),
      ].slice(0, 10);

      return NextResponse.json({ results });
    }

    // Default: natural language nutrients endpoint
    const res = await fetch(`${NUTRITIONIX_URL}/natural/nutrients`, {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Nutritionix error: ${res.status}`, detail: text },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Map to our format
    const foods = (data.foods ?? []).map((food: Record<string, unknown>) => ({
      name: food.food_name,
      serving_size: `${food.serving_qty} ${food.serving_unit}`,
      serving_weight_grams: food.serving_weight_grams,
      calories: Math.round((food.nf_calories as number) ?? 0),
      protein: Math.round(((food.nf_protein as number) ?? 0) * 10) / 10,
      carbs: Math.round(((food.nf_total_carbohydrate as number) ?? 0) * 10) / 10,
      fat: Math.round(((food.nf_total_fat as number) ?? 0) * 10) / 10,
      fiber: Math.round(((food.nf_dietary_fiber as number) ?? 0) * 10) / 10,
      sugar: Math.round(((food.nf_sugars as number) ?? 0) * 10) / 10,
      sodium: Math.round((food.nf_sodium as number) ?? 0),
      photo: (food.photo as Record<string, unknown>)?.thumb,
    }));

    return NextResponse.json({ foods });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch nutrition data" },
      { status: 500 }
    );
  }
}
