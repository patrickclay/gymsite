import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase/server";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fitnesssite-six.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const supabase = createServerClient();
    const { data: classes } = await supabase
      .from("classes")
      .select("id")
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true });

    const classEntries: MetadataRoute.Sitemap = (classes ?? []).map((c) => ({
      url: `${baseUrl}/schedule/${c.id}/signup`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticEntries, ...classEntries];
  } catch {
    return staticEntries;
  }
}
