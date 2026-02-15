import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return siteConfig.classTypes.map((ct) => ({ slug: ct.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const classType = siteConfig.classTypes.find((ct) => ct.slug === slug);
  if (!classType) return {};

  const title = `${classType.name} Classes in ${siteConfig.business.address.city}, GA`;
  const neighborhoodNames = siteConfig.neighborhoods
    .filter((n) => n.name !== siteConfig.business.address.city)
    .map((n) => n.name)
    .slice(0, 3);
  const description = `${classType.shortDescription} Small group ${classType.name.toLowerCase()} classes near ${neighborhoodNames.join(", ")} & ${siteConfig.business.address.city}. Capped at ${classType.capacity} — coaches who know your name.`;
  const canonical = `/classes/${classType.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: siteConfig.seo.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ClassTypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const classType = siteConfig.classTypes.find((ct) => ct.slug === slug);
  if (!classType) notFound();

  const nearbyNeighborhoods = siteConfig.neighborhoods.filter(
    (n) => n.name !== siteConfig.business.address.city
  );

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: classType.name,
    description: classType.longDescription,
    provider: {
      "@type": "HealthClub",
      name: siteConfig.business.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.business.address.street,
        addressLocality: siteConfig.business.address.city,
        addressRegion: siteConfig.business.address.state,
        postalCode: siteConfig.business.address.zip,
      },
    },
    areaServed: siteConfig.neighborhoods.map((n) => ({
      "@type": "City",
      name: `${n.name}, GA`,
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Page header */}
      <header
        className="relative overflow-hidden border-b border-stone-200/60"
        style={{ backgroundColor: "#e8e4df" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            &larr; Home
          </Link>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            {classType.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--muted)]">
            {classType.shortDescription}
          </p>
        </div>
      </header>

      <main>
        {/* Long description */}
        <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-lg leading-relaxed text-[var(--muted)]">
              {classType.longDescription}
            </p>
          </div>
        </section>

        {/* What to expect */}
        <section className="border-t border-stone-200/60 bg-stone-100/50">
          <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              What to expect
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  Small class size
                </h3>
                <p className="mt-2 text-[var(--muted)]">
                  Capped at {classType.capacity} people so your coach can give
                  real, individual attention every session. No getting lost in
                  the crowd.
                </p>
              </div>
              <div className="rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  Coaching that sees you
                </h3>
                <p className="mt-2 text-[var(--muted)]">
                  Your coach knows your name, your goals, and what you worked on
                  last week. Every class is scaled to meet you where you are
                  today.
                </p>
              </div>
              <div className="rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  All levels welcome
                </h3>
                <p className="mt-2 text-[var(--muted)]">
                  Whether it&apos;s your first day or your hundredth, the
                  programming meets you where you are. No prerequisites, no
                  judgment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Neighborhood CTA section */}
        <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Serving {siteConfig.business.address.city},{" "}
            {nearbyNeighborhoods
              .slice(0, 2)
              .map((n) => n.name)
              .join(", ")}{" "}
            &amp; more
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
            {siteConfig.business.name} is located in the heart of{" "}
            {siteConfig.business.address.city}, GA — easy to get to from
            anywhere in Gwinnett County.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nearbyNeighborhoods.map((neighborhood) => (
              <div
                key={neighborhood.name}
                className="rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {neighborhood.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-[var(--accent)]">
                  {neighborhood.driveTime} drive
                </p>
                <p className="mt-2 text-[var(--muted)]">
                  Looking for {classType.name.toLowerCase()} classes near{" "}
                  {neighborhood.name}? {siteConfig.business.name} is just{" "}
                  {neighborhood.driveTime} away in{" "}
                  {siteConfig.business.address.city}.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-stone-200/60 bg-stone-100/50">
          <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to try {classType.name.toLowerCase()}?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[var(--muted)]">
              Check the schedule, pick a time that works, and reserve your spot.
              No commitment required — just show up and let us take it from
              there.
            </p>
            <Link
              href="/schedule"
              className="mt-8 inline-block rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#c45c26" }}
            >
              View upcoming {classType.name.toLowerCase()} classes
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
