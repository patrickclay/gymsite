import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";
import { getAllPosts } from "@/lib/blog";

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
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/classes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/location`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const classTypeEntries: MetadataRoute.Sitemap = siteConfig.classTypes.map((ct) => ({
    url: `${baseUrl}/classes/${ct.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPosts = getAllPosts();
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

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

    return [...staticEntries, ...classTypeEntries, ...blogEntries, ...classEntries];
  } catch {
    return [...staticEntries, ...classTypeEntries, ...blogEntries];
  }
}
