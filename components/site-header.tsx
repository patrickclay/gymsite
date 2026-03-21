import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { TrackerNavLink } from "@/components/tracker/tracker-nav-link";

export function SiteHeader() {
  const links = [
    { href: "/classes", label: "Classes" },
    { href: "/schedule", label: "Schedule" },
    { href: "/about", label: "About" },
    { href: "/location", label: "Location" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <nav className="border-b border-slate-200/60 bg-[var(--background)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-tight text-[var(--foreground)]">
          <Image
            src="/neighborfit.png"
            alt={`${siteConfig.business.name} logo`}
            width={40}
            height={40}
            className="rounded-full"
          />
          {siteConfig.business.name}
        </Link>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)] sm:inline"
            >
              {link.label}
            </Link>
          ))}
          <TrackerNavLink />
          <Link
            href="/schedule"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#3b82f6" }}
          >
            Book a class
          </Link>
        </div>
      </div>
    </nav>
  );
}
