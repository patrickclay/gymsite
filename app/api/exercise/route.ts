import { NextRequest, NextResponse } from "next/server";

const API_NINJAS_KEY = process.env.API_NINJAS_KEY;
const API_NINJAS_URL = "https://api.api-ninjas.com/v1/caloriesburned";

export async function POST(req: NextRequest) {
  if (!API_NINJAS_KEY) {
    return NextResponse.json(
      { error: "API Ninjas key not configured. Set API_NINJAS_KEY in .env.local." },
      { status: 500 }
    );
  }

  const { activity, weight_lbs, duration_minutes } = await req.json();

  if (!activity || typeof activity !== "string") {
    return NextResponse.json({ error: "Missing activity" }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({ activity });
    if (weight_lbs) params.set("weight", String(weight_lbs));
    if (duration_minutes) params.set("duration", String(duration_minutes));

    const res = await fetch(`${API_NINJAS_URL}?${params}`, {
      headers: { "X-Api-Key": API_NINJAS_KEY },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `API Ninjas error: ${res.status}`, detail: text },
        { status: res.status }
      );
    }

    const data: Array<Record<string, unknown>> = await res.json();

    const results = data.map((item) => ({
      name: item.name as string,
      calories_per_hour: item.calories_per_hour as number,
      duration_minutes: item.duration_minutes as number,
      total_calories: item.total_calories as number,
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch exercise data" },
      { status: 500 }
    );
  }
}
