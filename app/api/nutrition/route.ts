import { NextRequest, NextResponse } from "next/server";

const API_NINJAS_KEY = process.env.API_NINJAS_KEY;
const API_NINJAS_URL = "https://api.api-ninjas.com/v1/nutrition";

export async function POST(req: NextRequest) {
  if (!API_NINJAS_KEY) {
    return NextResponse.json(
      { error: "API Ninjas key not configured. Set API_NINJAS_KEY in .env.local." },
      { status: 500 }
    );
  }

  const { query } = await req.json();

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${API_NINJAS_URL}?query=${encodeURIComponent(query)}`,
      { headers: { "X-Api-Key": API_NINJAS_KEY } }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `API Ninjas error: ${res.status}`, detail: text },
        { status: res.status }
      );
    }

    const data: Array<Record<string, unknown>> = await res.json();

    // Map to our format
    const foods = data.map((item) => ({
      name: item.name as string,
      serving_size: `${item.serving_size_g ?? 0}g`,
      calories: Math.round((item.calories as number) ?? 0),
      protein: Math.round(((item.protein_g as number) ?? 0) * 10) / 10,
      carbs: Math.round(((item.carbohydrates_total_g as number) ?? 0) * 10) / 10,
      fat: Math.round(((item.fat_total_g as number) ?? 0) * 10) / 10,
      fiber: Math.round(((item.fiber_g as number) ?? 0) * 10) / 10,
      sugar: Math.round(((item.sugar_g as number) ?? 0) * 10) / 10,
      sodium: Math.round((item.sodium_mg as number) ?? 0),
    }));

    return NextResponse.json({ foods });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch nutrition data" },
      { status: 500 }
    );
  }
}
