import { NextResponse } from "next/server";
import { createGateway, generateText } from "ai";
import { hasAdminSession } from "@/lib/admin-auth";

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? "",
});

export async function POST(request: Request) {
  // Admin-only endpoint
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, type, instructor, duration, capacity } = body;

  if (!name || !type) {
    return NextResponse.json(
      { error: "Class name and type are required." },
      { status: 400 }
    );
  }

  if (!process.env.AI_GATEWAY_API_KEY?.trim()) {
    return NextResponse.json(
      { error: "AI Gateway is not configured. Add AI_GATEWAY_API_KEY to your environment." },
      { status: 503 }
    );
  }

  try {
    const { text } = await generateText({
      model: gateway("openai/gpt-4o-mini"),
      system: `You write short, compelling class descriptions for a boutique fitness studio in the Atlanta area. The studio specializes in strength & conditioning, kickboxing & self-defense, and somatic movement. The coaches have 20+ years combined experience and pride themselves on knowing every member by name.

Your descriptions should be:
- 2-3 sentences max (under 200 characters ideal for social sharing, under 300 characters max)
- SEO-friendly: naturally include the class type, "Atlanta", and relevant fitness keywords
- Compelling and human: speak to what the student will feel and gain, not just what they'll do
- Match the brand voice: warm, confident, inclusive — "we see you" energy
- Never use generic gym clichés like "crush your goals" or "no pain no gain"

Return ONLY the description text, no quotes, no labels, no markdown.`,
      prompt: `Write a class description for:
- Class name: ${name}
- Type: ${type}
${instructor ? `- Instructor: ${instructor}` : ""}
${duration ? `- Duration: ${duration} minutes` : ""}
${capacity ? `- Max class size: ${capacity} people` : ""}`,
    });

    return NextResponse.json({ description: text.trim() });
  } catch (e) {
    console.error("AI description generation error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? message
            : "Failed to generate description. Check AI Gateway configuration.",
      },
      { status: 500 }
    );
  }
}
