import Link from "next/link";
import { EmailSignupForm } from "@/components/email-signup-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-stone-200/60">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
              Coming Soon &middot; Atlanta Area
            </p>
            <Link href="/schedule" className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]">
              Schedule
            </Link>
          </div>
          <h1 className="max-w-3xl font-bold tracking-tight text-[var(--foreground)] text-4xl sm:text-5xl lg:text-6xl">
            You&apos;ve been looking for a fitness program that actually sees you.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--muted)]">
            We spent 20+ years coaching in other people&apos;s spaces. Now we&apos;re building our own—and we&apos;re building it with you. A place where coaches know your name, your goals, and what you need to get there.
          </p>

          {/* Email capture - above fold */}
          <div className="mt-10">
            <EmailSignupForm buttonText="Be Part of It from Day One" />
          </div>
        </div>
      </header>

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
        <Link
          href="/schedule"
          className="mt-4 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          See upcoming classes and reserve your spot →
        </Link>
        <div className="mt-8 sm:mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Strength & conditioning",
              desc: "Learn what your body can actually do when someone\u2019s paying attention. Real coaching, real progression\u2014from unsure to confident under the bar. 12 people max, so your coach tracks your progress week to week.",
            },
            {
              title: "Kickboxing & self-defense",
              desc: "Walk in carrying your day. Walk out carrying yourself differently. Empowering, challenging, and built around skills that stay with you. Capped at 16 with a coach who adjusts every drill to your level.",
            },
            {
              title: "Somatic movement",
              desc: "The class no one expects to love\u2014and can\u2019t stop talking about. Psychology meets movement. Restore the connection between your mind and body. Capped at 8 so your coach can give truly individual guidance.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
              <p className="mt-2 text-[var(--muted)]">{desc}</p>
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

      {/* Footer */}
      <footer className="border-t border-stone-200/60 py-6">
        <div className="mx-auto max-w-6xl px-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[var(--muted)]">
              Atlanta area &middot; Coming soon
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Founded by two coaches who&apos;d rather know your name than count your reps.
            </p>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Instagram</Link>
            <Link href="#" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Facebook</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
