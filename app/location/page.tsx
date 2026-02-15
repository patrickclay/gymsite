import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const { business, neighborhoods } = siteConfig;
const { address, phone, email, hours, geo } = business;

export const metadata = {
  title: "Location & Hours",
  description:
    "Find Seen Fitness in Lilburn, GA — gym near me Lilburn. View hours, directions, parking info, and neighborhoods we serve across Gwinnett County.",
  openGraph: {
    title: "Location & Hours | Seen Fitness",
    description:
      "Find Seen Fitness in Lilburn, GA — gym near me Lilburn. View hours, directions, parking info, and neighborhoods we serve across Gwinnett County.",
    url: "/location",
    type: "website",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Location & Hours | Seen Fitness",
    description:
      "Find Seen Fitness in Lilburn, GA — gym near me Lilburn. View hours, directions, parking info, and neighborhoods we serve across Gwinnett County.",
  },
};

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export default function LocationPage() {
  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
  const mapSrc = `https://maps.google.com/maps?q=${geo.lat},${geo.lng}&z=14&output=embed`;

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
            Location &amp; Hours
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
            Come see us in Lilburn, GA. Walk-ins welcome during staffed hours.
          </p>
        </div>
      </header>

      {/* Address + Hours */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Address & Contact */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Find us
            </h2>
            <address className="mt-6 not-italic leading-relaxed text-[var(--muted)]">
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {business.name}
              </p>
              <p className="mt-1">{address.street}</p>
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
            </address>

            <div className="mt-6 space-y-2 text-[var(--muted)]">
              <p>
                <span className="font-medium text-[var(--foreground)]">
                  Phone:{" "}
                </span>
                <a href={`tel:${phone}`} className="hover:text-[var(--accent)]">
                  {phone}
                </a>
              </p>
              <p>
                <span className="font-medium text-[var(--foreground)]">
                  Email:{" "}
                </span>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-[var(--accent)]"
                >
                  {email}
                </a>
              </p>
            </div>

            {/* Parking */}
            <div className="mt-8 rounded-xl border border-stone-200/60 bg-stone-100/50 p-5">
              <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
                Parking
              </p>
              <p className="mt-2 text-[var(--muted)]">
                Free parking available in our lot.
              </p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Hours of operation
            </h2>
            <div className="mt-6 overflow-hidden rounded-xl border border-stone-200/60 bg-white/80 backdrop-blur-sm">
              <table className="w-full text-left">
                <tbody>
                  {daysOfWeek.map((day) => (
                    <tr
                      key={day}
                      className="border-b border-stone-200/60 last:border-b-0"
                    >
                      <td className="px-5 py-3.5 font-medium capitalize text-[var(--foreground)]">
                        {day}
                      </td>
                      <td className="px-5 py-3.5 text-right text-[var(--muted)]">
                        {hours[day]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Embed */}
      <section className="mx-auto max-w-6xl px-6 pb-12 sm:pb-16">
        <div className="overflow-hidden rounded-xl border border-stone-200/60">
          <iframe
            title={`${business.name} location on Google Maps`}
            src={mapSrc}
            className="aspect-video w-full"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="mt-3 text-center text-sm text-[var(--muted)]">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${geo.lat},${geo.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)]"
          >
            Open in Google Maps &rarr;
          </a>
        </p>
      </section>

      {/* Neighborhoods */}
      <section className="border-y border-stone-200/60 bg-stone-100/50">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Neighborhoods we serve
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Serving the greater Gwinnett County area.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {neighborhoods.map((n) => (
              <div
                key={n.name}
                className="rounded-xl border border-stone-200/60 bg-white/80 p-5 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {n.name}
                  </h3>
                  <span className="shrink-0 rounded-full border border-stone-200/60 bg-stone-100 px-3 py-1 text-xs font-medium text-[var(--foreground)]">
                    {n.driveTime}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {n.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-stone-200/60 bg-stone-100/50">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to visit?
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Check out our schedule and reserve your first class.
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
