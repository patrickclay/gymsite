import Link from "next/link";
import { Dumbbell, Flame, Wind, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const iconMap: Record<string, LucideIcon> = {
  Dumbbell,
  Flame,
  Wind,
};

export const metadata = {
  title: "Our Classes",
  description:
    "Explore fitness classes in Lilburn, GA — strength & conditioning, kickboxing, and somatic movement. Small group coaching where your coach knows your name.",
  openGraph: {
    title: "Our Classes | Seen Fitness",
    description:
      "Explore fitness classes in Lilburn, GA — strength & conditioning, kickboxing, and somatic movement. Small group coaching where your coach knows your name.",
    url: "/classes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Our Classes | Seen Fitness",
    description:
      "Explore fitness classes in Lilburn, GA — strength & conditioning, kickboxing, and somatic movement. Small group coaching where your coach knows your name.",
  },
};

export default function ClassesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Page header */}
      <header className="border-b border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[var(--foreground)]">
            Our Classes
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
            Small group coaching where every coach knows your name, your goals,
            and what you need to get there. Three class types, all capped for
            quality.
          </p>
        </div>
      </header>

      {/* Class type cards */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.classTypes.map((classType) => {
            const Icon = iconMap[classType.icon];
            return (
              <div
                key={classType.slug}
                className="flex flex-col rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm"
              >
                {Icon && (
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100">
                    <Icon className="h-6 w-6 text-[var(--accent)]" />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  {classType.name}
                </h2>
                <p className="mt-2 flex-1 text-[var(--muted)]">
                  {classType.shortDescription}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-[var(--foreground)]">
                    Max {classType.capacity} per class
                  </span>
                </div>
                <Link
                  href={`/classes/${classType.slug}`}
                  className="mt-5 text-sm font-semibold text-[var(--accent)] hover:opacity-80 transition-opacity"
                >
                  Learn more &rarr;
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-stone-200/60 bg-stone-100/50">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-[var(--foreground)]">
            Ready to book?
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Check our schedule and reserve your spot in a class that fits your
            week.
          </p>
          <Link
            href="/schedule"
            className="mt-6 inline-block rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#c45c26" }}
          >
            View schedule
          </Link>
        </div>
      </section>
    </div>
  );
}
