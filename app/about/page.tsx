import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "About Us",
  description:
    "The story behind Seen Fitness — two coaches building a gym where every person is known, coached, and challenged. Small group fitness in Lilburn, Gwinnett County.",
  openGraph: {
    title: "About Us | Seen Fitness",
    description:
      "The story behind Seen Fitness — two coaches building a gym where every person is known, coached, and challenged. Small group fitness in Lilburn, Gwinnett County.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "About Us | Seen Fitness",
    description:
      "The story behind Seen Fitness — two coaches building a gym where every person is known, coached, and challenged. Small group fitness in Lilburn, Gwinnett County.",
  },
};

export default function AboutPage() {
  const { about, instructors } = siteConfig;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <header className="border-b border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            &larr; Home
          </Link>
          <h1 className="mt-6 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {about.storyHeadline}
          </h1>
        </div>
      </header>

      {/* Story */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-2xl">
          {about.storyBody.map((paragraph, i) => (
            <p
              key={i}
              className="mt-4 first:mt-0 text-lg leading-relaxed text-[var(--muted)]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-stone-200/60 bg-stone-100/50">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
            Our mission
          </p>
          <blockquote className="mt-4 max-w-2xl text-xl font-semibold leading-relaxed text-[var(--foreground)] sm:text-2xl">
            &ldquo;{about.mission}&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Instructors */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Meet your coaches
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          The people who&apos;ll know your name by day one.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {instructors.map((instructor) => (
            <div
              key={instructor.slug}
              className="rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm"
            >
              <p className="text-sm font-medium text-[var(--accent)]">
                {instructor.role}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                {instructor.name}
              </h3>
              <p className="mt-3 leading-relaxed text-[var(--muted)]">
                {instructor.bio}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {instructor.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-full border border-stone-200/60 bg-stone-100 px-3 py-1 text-xs font-medium text-[var(--foreground)]"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-stone-200/60 bg-stone-100/50">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to be seen?
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Check out our schedule and book your first class.
          </p>
          <Link
            href="/schedule"
            className="mt-6 inline-block rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#c45c26" }}
          >
            View schedule &amp; book a class
          </Link>
        </div>
      </section>
    </div>
  );
}
