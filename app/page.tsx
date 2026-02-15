import Link from "next/link";
import { EmailSignupForm } from "@/components/email-signup-form";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  const { hero, classTypes, instructors, testimonials } = siteConfig;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-stone-200/60" style={{ backgroundColor: "#e8e4df" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
              {hero.badge}
            </p>
          </div>
          <h1 className="max-w-3xl font-bold tracking-tight text-[var(--foreground)] text-4xl sm:text-5xl lg:text-6xl">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--muted)]">
            {hero.subheadline}
          </p>
          <Link
            href={hero.ctaHref}
            className="mt-8 inline-block rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#c45c26" }}
          >
            {hero.ctaText}
          </Link>
        </div>
      </section>

      {/* We Get It - empathy bridge */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-14 md:py-16">
        <div className="max-w-2xl">
          <p className="text-lg text-[var(--muted)] leading-relaxed">
            Maybe you&apos;ve tried the big-box classes where no one learns your name.
            Maybe you followed a cookie-cutter program that never met you where you are.
            Or maybe you&apos;ve been waiting because it feels like you need to already be fit just to walk through the door.
          </p>
          <p className="mt-6 text-lg font-medium text-[var(--foreground)] leading-relaxed">
            We spent 20 years coaching in spaces that weren&apos;t built for the people who needed them most. So we&apos;re building one that is.
          </p>
        </div>
      </section>

      {/* Class offerings */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Three ways in. All of them yours.
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          Every class is small enough that your coaches know your name by day one.
        </p>
        <div className="mt-8 sm:mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {classTypes.map((ct) => (
            <Link
              key={ct.slug}
              href={`/classes/${ct.slug}`}
              className="rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{ct.name}</h3>
              <p className="mt-2 text-[var(--muted)]">{ct.shortDescription}</p>
              <p className="mt-3 text-sm font-medium text-[var(--accent)]">
                {ct.capacity} person max &rarr;
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Meet Your Coaches */}
      <section className="border-t border-stone-200/60 bg-stone-100/50">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Meet your coaches
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            The people who&apos;ll know your name, your goals, and what you need to get there.
          </p>
          <div className="mt-8 sm:mt-10 grid gap-8 sm:grid-cols-2">
            {instructors.map((instructor) => (
              <div
                key={instructor.slug}
                className="rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm"
              >
                <p className="text-lg font-semibold text-[var(--foreground)]">{instructor.name}</p>
                <p className="text-sm font-medium text-[var(--accent)]">{instructor.role}</p>
                <p className="mt-3 text-[var(--muted)]">{instructor.bio}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {instructor.specialties.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-stone-200/60 px-3 py-1 text-xs font-medium text-[var(--muted)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          What our members say
        </h2>
        <div className="mt-8 sm:mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm"
            >
              <p className="text-[var(--muted)] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-[var(--foreground)]">{t.name}</p>
              <p className="text-xs text-[var(--muted)]">Member since {t.memberSince}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Invitation - bottom CTA */}
      <section className="border-t border-stone-200/60 bg-stone-100/50">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            This isn&apos;t built yet. That&apos;s the point.
          </h2>
          <p className="mt-2 max-w-lg text-[var(--muted)]">
            Your input shapes the schedule, the classes, the culture. This isn&apos;t a newsletter—it&apos;s an invitation to build something with us.
          </p>
          <div className="mt-8">
            <EmailSignupForm buttonText="Count Me In" />
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            No spam. Just updates as we build this together.
          </p>
        </div>
      </section>
    </div>
  );
}
