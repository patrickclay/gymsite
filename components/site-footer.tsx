import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const { business, footer } = siteConfig;
  return (
    <footer className="border-t border-stone-200/60 bg-[var(--background)] py-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-semibold text-[var(--foreground)]">{business.name}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{footer.tagline}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Visit</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {business.address.street}<br />
              {business.address.city}, {business.address.state} {business.address.zip}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">{business.phone}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Explore</p>
            <div className="mt-2 flex flex-col gap-1">
              {[
                { href: "/classes", label: "Classes" },
                { href: "/schedule", label: "Schedule" },
                { href: "/about", label: "About Us" },
                { href: "/location", label: "Location" },
                { href: "/blog", label: "Blog" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Connect</p>
            <div className="mt-2 flex flex-col gap-1">
              <a href={business.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Instagram</a>
              <a href={business.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Facebook</a>
              <a href={`mailto:${business.email}`} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">{business.email}</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-stone-200/60 pt-6">
          <p className="text-xs text-[var(--muted)]">&copy; {new Date().getFullYear()} {footer.legalName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
