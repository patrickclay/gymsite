import { siteConfig } from "@/lib/site-config";

export function LocalBusinessSchema() {
  const { business } = siteConfig;
  const schema = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: business.name,
    description: siteConfig.seo.defaultDescription,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fitnesssite-six.vercel.app",
    telephone: business.phone,
    email: business.email,
    priceRange: business.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      postalCode: business.address.zip,
      addressCountry: business.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.lat,
      longitude: business.geo.lng,
    },
    openingHoursSpecification: Object.entries(business.hours)
      .filter(([, value]) => value !== "Closed")
      .map(([day, value]) => {
        const [open, close] = value.split(" – ");
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
          opens: open,
          closes: close,
        };
      }),
    areaServed: siteConfig.neighborhoods.map((n) => ({
      "@type": "City",
      name: `${n.name}, GA`,
    })),
    sameAs: Object.values(business.socials),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
