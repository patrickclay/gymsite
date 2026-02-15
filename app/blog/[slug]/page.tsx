import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { siteConfig } from "@/lib/site-config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const title = siteConfig.seo.titleTemplate.replace("%s", post.title);

  return {
    title,
    description: post.description,
    openGraph: {
      title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      images: [siteConfig.seo.ogImage],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description: post.description,
    },
  };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.business.name,
    },
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Back link + header */}
      <header className="border-b border-stone-200/60">
        <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:opacity-80 transition-opacity"
          >
            &larr; Back to blog
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[var(--foreground)]">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.author && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>By {post.author}</span>
              </>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
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
        </div>
      </header>

      {/* MDX content */}
      <article className="mx-auto max-w-3xl px-6 py-12 sm:py-16 lg:py-20">
        <div className="rounded-xl border border-stone-200/60 bg-white/80 p-6 sm:p-10 backdrop-blur-sm">
          <div
            className={[
              /* Headings */
              "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-[var(--foreground)] [&_h1]:mt-10 [&_h1]:mb-4",
              "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-[var(--foreground)] [&_h2]:mt-8 [&_h2]:mb-3",
              "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--foreground)] [&_h3]:mt-6 [&_h3]:mb-2",
              "[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[var(--foreground)] [&_h4]:mt-4 [&_h4]:mb-2",
              /* Paragraphs */
              "[&_p]:text-base [&_p]:leading-7 [&_p]:text-[var(--foreground)] [&_p]:mb-4",
              /* Links */
              "[&_a]:text-[#c45c26] [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:opacity-80 [&_a]:transition-opacity",
              /* Lists */
              "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1",
              "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1",
              "[&_li]:text-base [&_li]:leading-7 [&_li]:text-[var(--foreground)]",
              /* Blockquotes */
              "[&_blockquote]:border-l-4 [&_blockquote]:border-[#c45c26] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[var(--muted)] [&_blockquote]:my-6",
              /* Code */
              "[&_code]:rounded [&_code]:bg-stone-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono",
              "[&_pre]:rounded-lg [&_pre]:bg-stone-900 [&_pre]:text-stone-100 [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:mb-4",
              "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
              /* Horizontal rule */
              "[&_hr]:my-8 [&_hr]:border-stone-200",
              /* Images */
              "[&_img]:rounded-lg [&_img]:my-6",
              /* Strong / em */
              "[&_strong]:font-semibold",
              /* First child margin reset */
              "[&>*:first-child]:mt-0",
            ].join(" ")}
          >
            <MDXRemote source={post.content} />
          </div>
        </div>
      </article>
    </div>
  );
}
