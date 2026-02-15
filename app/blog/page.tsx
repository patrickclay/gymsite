import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Blog | Seen Fitness — Lilburn, GA",
  description:
    "Fitness tips, training insights, and community stories from Seen Fitness in Lilburn, GA. Stay informed on strength, kickboxing, somatic movement, and local wellness.",
  openGraph: {
    title: "Blog | Seen Fitness — Lilburn, GA",
    description:
      "Fitness tips, training insights, and community stories from Seen Fitness in Lilburn, GA. Stay informed on strength, kickboxing, somatic movement, and local wellness.",
    url: "/blog",
    type: "website",
    images: [siteConfig.seo.ogImage],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Blog | Seen Fitness — Lilburn, GA",
    description:
      "Fitness tips, training insights, and community stories from Seen Fitness in Lilburn, GA. Stay informed on strength, kickboxing, somatic movement, and local wellness.",
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Page header */}
      <header className="border-b border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[var(--foreground)]">
            Blog
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
            Training tips, community stories, and insights from the coaches at{" "}
            {siteConfig.business.name}.
          </p>
        </div>
      </header>

      {/* Posts listing */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-[var(--muted)]">
              No posts yet. Check back soon for training tips and community
              updates.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm"
              >
                {/* Date */}
                <time
                  dateTime={post.date}
                  className="text-sm text-[var(--muted)]"
                >
                  {formatDate(post.date)}
                </time>

                {/* Title */}
                <h2 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  {post.title}
                </h2>

                {/* Description */}
                <p className="mt-2 flex-1 text-sm text-[var(--muted)]">
                  {post.description}
                </p>

                {/* Author */}
                {post.author && (
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    By {post.author}
                  </p>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-[var(--foreground)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read more */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 text-sm font-semibold text-[var(--accent)] hover:opacity-80 transition-opacity"
                >
                  Read more &rarr;
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
