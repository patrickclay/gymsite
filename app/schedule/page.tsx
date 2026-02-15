import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Class Schedule | Atlanta Area",
  description: "View upcoming classes and reserve your spot. Strength, kickboxing, somatic movement.",
  openGraph: {
    title: "Class Schedule | Atlanta Area",
    description: "View upcoming classes and reserve your spot. Strength, kickboxing, somatic movement.",
    url: "/schedule",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Class Schedule | Atlanta Area",
    description: "View upcoming classes and reserve your spot. Strength, kickboxing, somatic movement.",
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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-stone-200/60">
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
        {!classes?.length ? (
          <div className="rounded-xl border border-stone-200/60 bg-white/80 p-8 text-center">
            <p className="text-[var(--muted)]">
              No upcoming classes right now. Check back soon or join the list to get notified.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => {
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
                  className="flex flex-col rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm"
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
                  <Link
                    href={`/schedule/${c.id}/signup`}
                    className="mt-4 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#c45c26" }}
                  >
                    Reserve spot
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
