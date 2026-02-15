import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  const links = [
    { href: "/classes", label: "Classes" },
    { href: "/schedule", label: "Schedule" },
    { href: "/about", label: "About" },
    { href: "/location", label: "Location" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <nav className="border-b border-stone-200/60 bg-[var(--background)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-[var(--foreground)]">
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
          <Link
            href="/schedule"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#c45c26" }}
          >
            Book a class
          </Link>
        </div>
      </div>
    </nav>
  );
}
