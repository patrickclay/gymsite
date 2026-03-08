import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

// Sample classes shown when the database has no upcoming classes yet
function getSampleClasses() {
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + ((1 - now.getDay() + 7) % 7 || 7));
  nextMonday.setHours(6, 0, 0, 0);

  const day = (offset: number, hour: number, minute = 0) => {
    const d = new Date(nextMonday);
    d.setDate(d.getDate() + offset);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  return [
    { id: "sample-1", name: "Morning Burn: Full Body Strength", type: "Strength & Conditioning", instructor: "Coach Patrick", start_time: day(0, 6), duration_minutes: 50, capacity: 12, price_cents: 2500, description: "Start the week strong with compound lifts, kettlebell work, and functional movement. All levels welcome—every exercise is scaled to you." },
    { id: "sample-2", name: "Power Kickboxing", type: "Kickboxing & Self-Defense", instructor: "Coach Patrick", start_time: day(0, 9, 30), duration_minutes: 45, capacity: 16, price_cents: 2000, description: "High-energy striking combos, heavy bag rounds, and partner drills. Walk out feeling like you can take on the world." },
    { id: "sample-3", name: "Midday Reset: Somatic Flow", type: "Somatic Movement", instructor: "Coach Jamie", start_time: day(1, 12), duration_minutes: 40, capacity: 8, price_cents: 2000, description: "Breathwork, gentle stretching, and mindful movement to release tension and reconnect. Perfect for a lunch-hour reset." },
    { id: "sample-4", name: "Barbell Foundations", type: "Strength & Conditioning", instructor: "Coach Patrick", start_time: day(1, 17, 30), duration_minutes: 55, capacity: 12, price_cents: 2500, description: "Deadlifts, squats, presses—learn proper barbell technique in a supportive small group. Great for beginners and intermediate lifters." },
    { id: "sample-5", name: "Cardio Kickboxing & Self-Defense", type: "Kickboxing & Self-Defense", instructor: "Coach Patrick", start_time: day(2, 6), duration_minutes: 45, capacity: 16, price_cents: 2000, description: "Jab-cross-hook combos meet real self-defense drills. Build cardio endurance and learn skills that stay with you." },
    { id: "sample-6", name: "Strength & Sweat", type: "Strength & Conditioning", instructor: "Coach Jamie", start_time: day(2, 18), duration_minutes: 50, capacity: 12, price_cents: 2500, description: "Supersets, circuits, and progressive overload designed to challenge you wherever you are. Expect to sweat." },
    { id: "sample-7", name: "Somatic Stress Release", type: "Somatic Movement", instructor: "Coach Jamie", start_time: day(3, 9), duration_minutes: 40, capacity: 8, price_cents: 2000, description: "Neuroscience-rooted movement patterns to release chronic tension. You'll leave feeling lighter than you have in weeks." },
    { id: "sample-8", name: "Fight Night: Advanced Kickboxing", type: "Kickboxing & Self-Defense", instructor: "Coach Patrick", start_time: day(3, 18, 30), duration_minutes: 50, capacity: 16, price_cents: 2500, description: "Longer combos, defensive footwork, and sparring drills for members with some kickboxing experience. Bring your A-game." },
    { id: "sample-9", name: "Friday Lift: Upper Body Focus", type: "Strength & Conditioning", instructor: "Coach Patrick", start_time: day(4, 6), duration_minutes: 50, capacity: 12, price_cents: 2500, description: "Bench press, rows, overhead press, and accessory work. End the week with arms that earned the weekend." },
    { id: "sample-10", name: "Community WOD", type: "Strength & Conditioning", instructor: "Coach Patrick & Coach Jamie", start_time: day(5, 9), duration_minutes: 60, capacity: 16, price_cents: 1500, description: "Our signature Saturday workout—both coaches, full community energy. All levels, all vibes. Stick around for coffee after." },
  ];
}

export const metadata = {
  title: `Class Schedule | ${siteConfig.business.name} — ${siteConfig.business.address.city}, ${siteConfig.business.address.state}`,
  description: `View upcoming fitness classes and reserve your spot at ${siteConfig.business.name} in ${siteConfig.business.address.city}, GA. Strength, kickboxing, and somatic movement.`,
  openGraph: {
    title: `Class Schedule | ${siteConfig.business.name}`,
    description: `View upcoming fitness classes and reserve your spot at ${siteConfig.business.name} in ${siteConfig.business.address.city}, GA.`,
    url: "/schedule",
    type: "website",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: `Class Schedule | ${siteConfig.business.name}`,
    description: `View upcoming fitness classes and reserve your spot at ${siteConfig.business.name} in ${siteConfig.business.address.city}, GA.`,
  },
};

export default async function SchedulePage() {
  let classes: { id: string; name: string; type: string; instructor: string; start_time: string; duration_minutes: number; capacity: number; price_cents: number; description: string | null }[] | null = null;

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("classes")
      .select("id, name, type, instructor, start_time, duration_minutes, capacity, price_cents, description")
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Supabase schedule query error:", error);
    } else {
      classes = data;
    }
  } catch (e) {
    console.error("Schedule page error:", e);
  }

  // Fall back to sample classes when database has none
  const displayClasses = classes?.length ? classes : getSampleClasses();
  const isSample = !classes?.length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-slate-200/60">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← Home
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Class schedule
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Reserve your spot. Payment is collected at the start of class.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        {isSample && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-center">
            <p className="text-sm font-medium text-amber-800">
              Sample schedule — here&apos;s what a typical week looks like. Exact times may vary.
            </p>
          </div>
        )}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayClasses.map((c) => {
            const start = new Date(c.start_time);
            const dateStr = start.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
            const timeStr = start.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
            const priceDollars = (c.price_cents / 100).toFixed(0);
            return (
              <li
                key={c.id}
                className="flex flex-col rounded-xl border border-slate-200/60 bg-white/80 p-6 backdrop-blur-sm"
              >
                <p className="text-sm font-medium text-[var(--accent)]">{c.type}</p>
                <h2 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                  {c.name}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{c.instructor}</p>
                {c.description && (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/80 line-clamp-2">
                    {c.description}
                  </p>
                )}
                <p className="mt-2 text-sm text-[var(--foreground)]">
                  {dateStr} · {timeStr}
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                  ${priceDollars} · {c.duration_minutes} min
                </p>
                {isSample ? (
                  <span className="mt-4 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white opacity-70"
                    style={{ backgroundColor: "#3b82f6" }}
                  >
                    Coming soon
                  </span>
                ) : (
                  <Link
                    href={`/schedule/${c.id}/signup`}
                    className="mt-4 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#3b82f6" }}
                  >
                    Reserve spot
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
