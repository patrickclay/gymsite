import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ReservationForm } from "./reservation-form";
import { ShareClassSection } from "./share-class-section";

function buildClassMeta(classRow: {
  name: string;
  type: string;
  instructor: string;
  start_time: string;
  duration_minutes: number;
  description: string | null;
}) {
  const start = new Date(classRow.start_time);
  const dateTimeStr = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const title = `${classRow.name} | ${classRow.type} — Atlanta Area`.slice(0, 60);
  const description =
    classRow.description?.slice(0, 155) ||
    `${classRow.type} with ${classRow.instructor}. ${dateTimeStr}. Reserve your spot. Atlanta area.`.slice(0, 155);
  return { title, description };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("classes")
    .select("id, name, type, instructor, start_time, duration_minutes, description")
    .eq("id", classId)
    .single();
  if (!data) {
    return { title: "Reserve your spot" };
  }
  const { title, description } = buildClassMeta({
    ...data,
    description: data.description ?? null,
  });
  const canonicalPath = `/schedule/${classId}/signup`;
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://fitnesssite-six.vercel.app";
  const classSignupUrl = `${siteUrl}/schedule/${classId}/signup`;
  const sharePayload = {
    title: `${classRow.name} | ${classRow.type} — Atlanta Area`,
    text: `${classRow.name} — Reserve your spot. Atlanta area.`,
    url: classSignupUrl,
  };

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

  const endDate = new Date(start);
  endDate.setMinutes(endDate.getMinutes() + classRow.duration_minutes);
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: classRow.name,
    startDate: start.toISOString(),
    endDate: endDate.toISOString(),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Atlanta Area",
    },
    organizer: {
      "@type": "Organization",
      name: "Atlanta Area Fitness",
    },
    offers: {
      "@type": "Offer",
      price: classRow.price_cents / 100,
      priceCurrency: "USD",
    },
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
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

        <ShareClassSection sharePayload={sharePayload} />

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Reserve your spot</h2>
          <ReservationForm classId={classId} className={classRow.name} shareUrl={classSignupUrl} />
        </div>
      </main>
    </div>
  );
}
