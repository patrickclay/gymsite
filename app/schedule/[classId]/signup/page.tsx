import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ReservationForm } from "./reservation-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("classes")
    .select("name")
    .eq("id", classId)
    .single();
  return {
    title: data ? `Reserve: ${data.name}` : "Reserve your spot",
  };
}

export default async function SignupPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const supabase = createServerClient();
  const { data: classRow, error } = await supabase
    .from("classes")
    .select("id, name, type, instructor, start_time, duration_minutes, price_cents, description")
    .eq("id", classId)
    .single();

  if (error || !classRow) notFound();

  const start = new Date(classRow.start_time);
  const dateStr = start.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const priceDollars = (classRow.price_cents / 100).toFixed(0);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <Link
            href="/schedule"
            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← Schedule
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10 sm:py-12">
        <div className="rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm">
          <p className="text-sm font-medium text-[var(--accent)]">{classRow.type}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{classRow.name}</h1>
          <p className="mt-2 text-[var(--muted)]">{classRow.instructor}</p>
          <p className="mt-2 text-[var(--foreground)]">
            {dateStr} · {timeStr} · {classRow.duration_minutes} min
          </p>
          <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
            ${priceDollars}
          </p>
          {classRow.description && (
            <p className="mt-4 text-[var(--muted)]">{classRow.description}</p>
          )}
          <p className="mt-4 text-sm text-[var(--muted)]">
            Payment will be collected at the start of class (cash, card, or Venmo accepted).
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Reserve your spot</h2>
          <ReservationForm classId={classId} />
        </div>
      </main>
    </div>
  );
}
