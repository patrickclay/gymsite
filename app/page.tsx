import Link from "next/link";
import { EmailSignupForm } from "@/components/email-signup-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-stone-200/60">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-32">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
            Coming Soon · Atlanta Area
          </p>
          <h1 className="max-w-3xl font-bold tracking-tight text-[var(--foreground)] text-4xl sm:text-5xl lg:text-6xl">
            We tested something new. The energy said it all.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--muted)]">
            It&apos;s time to expand. Two fitness pros—20+ years of strength training, nutrition, and conditioning meets kickboxing, somatic movement, and the mind-body connection. We&apos;re hunting for our space and building something special. Help us make it yours.
          </p>

          {/* Email capture - above fold */}
          <div className="mt-10">
            <EmailSignupForm buttonText="Stay in the Loop" />
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Tell us your ideal schedule—early mornings, evenings after work, or weekend sessions? We&apos;re listening.
          </p>
        </div>
      </header>

      {/* Class offerings */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Cooking up something special
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          Strength, conditioning, kickboxing, somatic movement—and a whole lot of heart.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Strength & conditioning", desc: "Real coaching from 20+ years of experience. Weight management and progression built in." },
            { title: "Kickboxing & self-defense", desc: "Empowering, challenging, and transformative. Build skills that last." },
            { title: "Somatic movement", desc: "Mind-body connection. Psychology meets movement. Restore and reconnect." },
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

      {/* Email capture - below fold */}
      <section className="border-t border-stone-200/60 bg-stone-100/50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Help us build this
          </h2>
          <p className="mt-2 max-w-lg text-[var(--muted)]">
            Early mornings? Evenings after work? Weekend warrior sessions? Tell us your perfect schedule—we&apos;re designing this with you.
          </p>
          <div className="mt-8">
            <EmailSignupForm buttonText="Stay in the Loop" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--muted)]">
            Atlanta area · Coming soon
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Instagram</Link>
            <Link href="#" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Facebook</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
