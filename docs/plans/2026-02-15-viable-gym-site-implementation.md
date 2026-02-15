# Viable Gym Site Build-Out Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the existing MVP into a launchable, SEO-optimized, neighborhood-focused single-location fitness studio website with config-driven content, new pages (about, classes, location, blog), best-in-class local SEO, and enhanced social sharing.

**Architecture:** All static site content lives in `lib/site-config.ts` — a single TypeScript config file. New pages import from this config. Dynamic data (classes, bookings, subscribers) stays in Supabase. Blog posts are MDX files in `content/blog/`. A shared header/footer provides consistent navigation.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Supabase, Lucide icons, Syne font. New: `next-mdx-remote` for blog MDX rendering.

---

### Task 1: Create Site Config (`lib/site-config.ts`)

**Files:**
- Create: `lib/site-config.ts`

**Step 1: Create the site config file**

This is the central content file. All static content lives here. Use placeholder values that make the structure clear — the gym owner will fill in real values.

```typescript
// lib/site-config.ts

export const siteConfig = {
  business: {
    name: "Seen Fitness",
    tagline: "A fitness program that actually sees you.",
    address: {
      street: "123 Main Street",
      city: "Lilburn",
      state: "GA",
      zip: "30047",
      country: "US",
    },
    phone: "(770) 555-0123",
    email: "hello@seenfitness.com",
    hours: {
      monday: "6:00 AM – 8:00 PM",
      tuesday: "6:00 AM – 8:00 PM",
      wednesday: "6:00 AM – 8:00 PM",
      thursday: "6:00 AM – 8:00 PM",
      friday: "6:00 AM – 6:00 PM",
      saturday: "8:00 AM – 12:00 PM",
      sunday: "Closed",
    },
    geo: { lat: 33.8901, lng: -84.1430 },
    socials: {
      instagram: "https://instagram.com/seenfitness",
      facebook: "https://facebook.com/seenfitness",
    },
    priceRange: "$$",
    foundedYear: 2026,
  },

  seo: {
    titleTemplate: "%s | Seen Fitness — Lilburn, GA",
    defaultTitle: "Seen Fitness | Small Group Fitness in Lilburn, GA",
    defaultDescription:
      "Small group fitness classes with real coaching in Lilburn, GA. Strength, kickboxing, and somatic movement. Coaches who know your name.",
    keywords: [
      "gym Lilburn GA",
      "fitness classes Lilburn",
      "personal training Gwinnett County",
      "yoga near me Lilburn",
      "kickboxing Lilburn GA",
      "strength training Stone Mountain",
    ],
    ogImage: "/og-default.png",
  },

  hero: {
    badge: "Now Open · Lilburn, GA",
    headline: "You've been looking for a fitness program that actually sees you.",
    subheadline:
      "We spent 20+ years coaching in other people's spaces. Now we're building our own—and we're building it with you. A place where coaches know your name, your goals, and what you need to get there.",
    ctaText: "View schedule & reserve your spot",
    ctaHref: "/schedule",
  },

  classTypes: [
    {
      name: "Strength & Conditioning",
      slug: "strength-conditioning",
      shortDescription:
        "Learn what your body can actually do when someone's paying attention. Real coaching, real progression—from unsure to confident under the bar.",
      longDescription:
        "Our strength & conditioning classes are capped at 12 people so your coach tracks your progress week to week. Whether you're touching a barbell for the first time or chasing a new PR, every session is programmed with progressive overload and individual scaling. You'll learn proper form, build functional strength, and develop the confidence that carries over into everything else you do.",
      capacity: 12,
      icon: "Dumbbell",
    },
    {
      name: "Kickboxing & Self-Defense",
      slug: "kickboxing",
      shortDescription:
        "Walk in carrying your day. Walk out carrying yourself differently. Empowering, challenging, and built around skills that stay with you.",
      longDescription:
        "Our kickboxing classes are capped at 16 with a coach who adjusts every drill to your level. You'll learn real striking technique, build cardio endurance, and develop self-defense awareness—all in a supportive environment where beginners and experienced athletes train side by side. Every class ends with you feeling stronger than when you walked in.",
      capacity: 16,
      icon: "Flame",
    },
    {
      name: "Somatic Movement",
      slug: "somatic-movement",
      shortDescription:
        "The class no one expects to love—and can't stop talking about. Psychology meets movement. Restore the connection between your mind and body.",
      longDescription:
        "Capped at 8 so your coach can give truly individual guidance. Somatic movement blends breathwork, gentle stretching, and mindful movement patterns to release chronic tension and restore your body's natural ease. This isn't yoga—it's a practice rooted in neuroscience that helps you reconnect with how your body was meant to move. Perfect for stress relief, injury recovery, or anyone who feels disconnected from their body.",
      capacity: 8,
      icon: "Wind",
    },
  ],

  instructors: [
    {
      name: "Coach Name",
      slug: "coach-name",
      role: "Co-Founder & Head Coach",
      bio: "20+ years of coaching experience. Certified in strength & conditioning, kickboxing, and somatic movement. Passionate about creating spaces where everyone belongs.",
      specialties: ["Strength & Conditioning", "Kickboxing"],
      photo: "/instructors/placeholder.jpg",
    },
    {
      name: "Coach Name 2",
      slug: "coach-name-2",
      role: "Co-Founder & Movement Specialist",
      bio: "Background in psychology and movement science. Believes that fitness starts with feeling safe in your own body.",
      specialties: ["Somatic Movement", "Strength & Conditioning"],
      photo: "/instructors/placeholder.jpg",
    },
  ],

  testimonials: [
    {
      quote: "This is the first gym where I didn't feel like I had to already be fit to walk through the door.",
      name: "Sarah M.",
      memberSince: "2026",
    },
    {
      quote: "The coaches actually remember what we worked on last week. That's never happened to me at a gym.",
      name: "James T.",
      memberSince: "2026",
    },
    {
      quote: "I came for the kickboxing and stayed for the community. This place is special.",
      name: "Maria L.",
      memberSince: "2026",
    },
  ],

  neighborhoods: [
    {
      name: "Lilburn",
      description: "Our home base. Located right in the heart of Lilburn, GA.",
      driveTime: "0 min",
    },
    {
      name: "Stone Mountain",
      description: "Just a quick drive from Stone Mountain village.",
      driveTime: "10 min",
    },
    {
      name: "Tucker",
      description: "Easy access from Tucker via Highway 29.",
      driveTime: "12 min",
    },
    {
      name: "Norcross",
      description: "A short drive from Norcross and the Peachtree Corners area.",
      driveTime: "15 min",
    },
    {
      name: "Snellville",
      description: "Convenient for Snellville residents via Highway 78.",
      driveTime: "12 min",
    },
    {
      name: "Lawrenceville",
      description: "Quick access from Lawrenceville and greater Gwinnett County.",
      driveTime: "18 min",
    },
  ],

  about: {
    storyHeadline: "Two coaches. One mission. A gym that sees you.",
    storyBody: [
      "We spent 20 years coaching in other people's spaces—big-box gyms, boutique studios, corporate wellness programs. We watched talented people walk in, get ignored, and walk out.",
      "So we built Seen Fitness. A place where classes are small enough that your coaches actually know your name by day one. Where the programming meets you where you are, not where some algorithm thinks you should be.",
      "We're not trying to be the biggest gym in Gwinnett County. We're trying to be the one you actually look forward to walking into.",
    ],
    mission:
      "To create a fitness community where every person is coached, known, and challenged—regardless of where they're starting from.",
  },

  footer: {
    tagline: "Founded by two coaches who'd rather know your name than count your reps.",
    legalName: "Seen Fitness LLC",
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type ClassType = (typeof siteConfig.classTypes)[number];
export type Instructor = (typeof siteConfig.instructors)[number];
export type Neighborhood = (typeof siteConfig.neighborhoods)[number];
```

**Step 2: Verify the file compiles**

Run: `npx tsc --noEmit lib/site-config.ts`
Expected: No errors (or check via `npm run build` later)

**Step 3: Commit**

```bash
git add lib/site-config.ts
git commit -m "Add site config with all static content for gym site"
```

---

### Task 2: Create Reusable LocalBusiness Schema Component

**Files:**
- Create: `components/local-business-schema.tsx`

**Step 1: Create the JSON-LD schema component**

```typescript
// components/local-business-schema.tsx
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
```

**Step 2: Commit**

```bash
git add components/local-business-schema.tsx
git commit -m "Add reusable LocalBusiness JSON-LD schema component"
```

---

### Task 3: Create Site Header and Extract Site Footer

**Files:**
- Create: `components/site-header.tsx`
- Create: `components/site-footer.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx` (remove inline footer)

**Step 1: Create the site header**

```typescript
// components/site-header.tsx
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
```

**Step 2: Create the site footer**

Extract the footer from `app/page.tsx` into a reusable component, adding business info from config.

```typescript
// components/site-footer.tsx
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
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Connect</p>
            <div className="mt-2 flex flex-col gap-1">
              <a
                href={business.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Instagram
              </a>
              <a
                href={business.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Facebook
              </a>
              <a
                href={`mailto:${business.email}`}
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {business.email}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-stone-200/60 pt-6">
          <p className="text-xs text-[var(--muted)]">
            &copy; {new Date().getFullYear()} {footer.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

**Step 3: Update `app/layout.tsx`**

Add the header, footer, and update default metadata to use `siteConfig`. Import `LocalBusinessSchema`.

Key changes to `app/layout.tsx`:
- Import `SiteHeader`, `SiteFooter`, `LocalBusinessSchema` from components
- Import `siteConfig` from `lib/site-config`
- Update the `metadata` export to use `siteConfig.seo` values
- Wrap `{children}` with header above and footer below
- Add `<LocalBusinessSchema />` inside `<body>`
- Keep the admin page excluded from header/footer (check: admin pages have their own layout via the `admin-theme` class, so header/footer showing on admin is acceptable for now — admin is not public-facing)

**Step 4: Update `app/page.tsx`**

Remove the inline footer (lines 98-115) since the layout now provides it. Keep all other content. Replace hardcoded hero content with `siteConfig.hero` values. Replace hardcoded class type cards with `siteConfig.classTypes.map(...)`. Replace hardcoded footer text with nothing (footer is now in layout). Add social links from config.

Also add an instructor preview section and testimonials section to the homepage, sourcing from `siteConfig.instructors` and `siteConfig.testimonials`.

**Step 5: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds (may have runtime errors if Supabase env vars aren't set, but no TypeScript errors)

**Step 6: Commit**

```bash
git add components/site-header.tsx components/site-footer.tsx app/layout.tsx app/page.tsx
git commit -m "Add site header/footer, update layout and homepage to use site config"
```

---

### Task 4: Create `/about` Page

**Files:**
- Create: `app/about/page.tsx`

**Step 1: Create the about page**

This page renders the studio story, mission, and instructor bios from `siteConfig`.

Key elements:
- Import `siteConfig` from `lib/site-config`
- Export `metadata` with title using `siteConfig.seo.titleTemplate` pattern: `"About Us | Seen Fitness — Lilburn, GA"`
- OG and Twitter Card meta
- Story section: render `siteConfig.about.storyHeadline` and `siteConfig.about.storyBody` paragraphs
- Mission section: render `siteConfig.about.mission`
- Instructor bios section: map over `siteConfig.instructors`, show name, role, bio, specialties
- CTA at bottom: email signup or link to schedule

**Step 2: Commit**

```bash
git add app/about/page.tsx
git commit -m "Add /about page with studio story and instructor bios"
```

---

### Task 5: Create `/classes` Overview Page

**Files:**
- Create: `app/classes/page.tsx`

**Step 1: Create the class types overview page**

This page lists all class types from `siteConfig.classTypes` with links to individual pages.

Key elements:
- Import `siteConfig` from `lib/site-config`
- Export metadata: `"Our Classes | Seen Fitness — Lilburn, GA"` with description targeting "fitness classes Lilburn GA"
- OG and Twitter Card meta
- Hero/header: "Our Classes" with subtitle about small group coaching
- Grid of class type cards from `siteConfig.classTypes`
- Each card: name, short description, capacity badge ("Max 12 per class"), link to `/classes/[slug]`
- Use Lucide icons referenced by `classType.icon` field
- Bottom CTA: link to `/schedule` to book

**Step 2: Commit**

```bash
git add app/classes/page.tsx
git commit -m "Add /classes overview page with class type cards"
```

---

### Task 6: Create `/classes/[slug]` Individual Class Type Page

**Files:**
- Create: `app/classes/[slug]/page.tsx`

**Step 1: Create the individual class type page**

This is the key SEO page. Each class type gets its own URL (e.g., `/classes/yoga`) with neighborhood-targeted content.

Key elements:
- Import `siteConfig` from `lib/site-config`
- `generateStaticParams()` returns slugs from `siteConfig.classTypes`
- `generateMetadata()` builds title like "Strength & Conditioning Classes in Lilburn, GA | Seen Fitness" and description with neighborhood keywords
- OG and Twitter Card meta with canonical URL
- Long description from `siteConfig.classTypes[].longDescription`
- "What to expect" section with capacity, duration context
- **Neighborhood CTA section** at bottom: "Serving Lilburn, Stone Mountain, Tucker & more" with drive times from `siteConfig.neighborhoods`
- Natural copy like: "Looking for kickboxing classes near Stone Mountain? Seen Fitness is just 10 minutes away in Lilburn."
- CTA: link to `/schedule` filtered by this class type
- `Service` schema JSON-LD for this class type

```typescript
// Service schema example for the class type page
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: classType.name,
  description: classType.longDescription,
  provider: {
    "@type": "HealthClub",
    name: siteConfig.business.name,
    address: { /* from siteConfig.business.address */ },
  },
  areaServed: siteConfig.neighborhoods.map((n) => ({
    "@type": "City",
    name: `${n.name}, GA`,
  })),
};
```

**Step 2: Commit**

```bash
git add app/classes/\[slug\]/page.tsx
git commit -m "Add /classes/[slug] pages with neighborhood SEO and Service schema"
```

---

### Task 7: Create `/location` Page

**Files:**
- Create: `app/location/page.tsx`

**Step 1: Create the location page**

Key elements:
- Import `siteConfig` from `lib/site-config`
- Export metadata: "Location & Hours | Seen Fitness — Lilburn, GA" targeting "gym near me Lilburn"
- OG and Twitter Card meta
- Address section with full address from config
- Hours of operation table from `siteConfig.business.hours`
- Google Maps embed (iframe with the gym's coordinates — use a `src` URL like `https://www.google.com/maps/embed?pb=!1m18...` or a simpler `https://maps.google.com/maps?q={lat},{lng}&output=embed`)
- **Neighborhoods section**: grid of neighborhood cards from `siteConfig.neighborhoods` showing name, description, and drive time
- "Serving the greater Gwinnett County area" section
- Parking and access info
- CTA: "Ready to visit?" link to `/schedule`

**Step 2: Commit**

```bash
git add app/location/page.tsx
git commit -m "Add /location page with map, hours, and neighborhood drive times"
```

---

### Task 8: Set Up Blog Infrastructure

**Files:**
- Create: `lib/blog.ts`
- Create: `content/blog/welcome.mdx`
- Modify: `package.json` (add `next-mdx-remote` dependency)

**Step 1: Install MDX dependencies**

Run: `npm install next-mdx-remote gray-matter`

**Step 2: Create the blog utility module**

```typescript
// lib/blog.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  featuredImage?: string;
  content: string;
};

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "",
        author: data.author ?? "",
        tags: data.tags ?? [],
        featuredImage: data.featuredImage,
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    author: data.author ?? "",
    tags: data.tags ?? [],
    featuredImage: data.featuredImage,
    content,
  };
}
```

**Step 3: Create a sample blog post**

```markdown
---
title: "Why We Built Seen Fitness in Lilburn, GA"
description: "The story behind Lilburn's newest small group fitness studio — and why we chose this community."
date: "2026-02-15"
author: "Seen Fitness Team"
tags: ["community", "Lilburn", "fitness"]
---

## A gym built for people, not algorithms

After 20 years coaching in big-box gyms and boutique studios across the Atlanta metro, we knew something was missing. Most gyms are designed to sell memberships, not to actually coach people.

## Why Lilburn?

Lilburn and the surrounding Gwinnett County communities — Stone Mountain, Tucker, Norcross, Snellville — have incredible people who deserve better than a crowded class where nobody learns their name. We chose this neighborhood because it feels like home.

## What makes us different

Every class at Seen Fitness is capped. Strength & conditioning maxes out at 12. Kickboxing at 16. Somatic movement at 8. These aren't arbitrary numbers — they're the point at which a coach can no longer give you individual attention.

## Come see for yourself

Check out our [class schedule](/schedule) and reserve your first spot. We can't wait to meet you.
```

**Step 4: Commit**

```bash
git add lib/blog.ts content/blog/welcome.mdx package.json package-lock.json
git commit -m "Add blog infrastructure with MDX support and sample post"
```

---

### Task 9: Create `/blog` Listing Page

**Files:**
- Create: `app/blog/page.tsx`

**Step 1: Create the blog listing page**

Key elements:
- Import `getAllPosts` from `lib/blog` and `siteConfig` from `lib/site-config`
- Export metadata: "Blog | Seen Fitness — Lilburn, GA"
- List all posts sorted by date (newest first)
- Each post card: title, date, description, "Read more" link to `/blog/[slug]`
- Author name
- Tags as small badges
- Empty state if no posts

**Step 2: Commit**

```bash
git add app/blog/page.tsx
git commit -m "Add /blog listing page"
```

---

### Task 10: Create `/blog/[slug]` Detail Page

**Files:**
- Create: `app/blog/[slug]/page.tsx`

**Step 1: Create the blog detail page**

Key elements:
- Import `getPostBySlug`, `getAllPosts` from `lib/blog`
- Import `MDXRemote` from `next-mdx-remote/rsc` (RSC-compatible)
- `generateStaticParams()` returns all post slugs
- `generateMetadata()` builds title, description, OG, Twitter Card from post frontmatter
- Article schema JSON-LD:
  ```typescript
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.business.name,
    },
  };
  ```
- Render MDX content with `<MDXRemote source={post.content} />`
- Share section at bottom (reuse `ShareClassSection` pattern or simpler social links)
- "Back to blog" link
- Call `notFound()` if slug doesn't match

**Step 2: Commit**

```bash
git add app/blog/\[slug\]/page.tsx
git commit -m "Add /blog/[slug] detail page with MDX rendering and Article schema"
```

---

### Task 11: Create `robots.txt` and Update Sitemap

**Files:**
- Create: `public/robots.txt`
- Modify: `app/sitemap.ts`

**Step 1: Create robots.txt**

```
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://fitnesssite-six.vercel.app/sitemap.xml
```

Note: The sitemap URL should ideally use `NEXT_PUBLIC_SITE_URL` but robots.txt is a static file. Use the production URL. Alternatively, create `app/robots.ts` for a dynamic version:

```typescript
// app/robots.ts
import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fitnesssite-six.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/admin" },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

Use the dynamic `app/robots.ts` approach instead of static `public/robots.txt`.

**Step 2: Update sitemap to include new pages**

Add entries for `/about`, `/classes`, `/classes/[slug]` (each class type), `/location`, `/blog`, and `/blog/[slug]` (each post).

Import `siteConfig` and `getAllPosts` to generate dynamic entries.

Updated `app/sitemap.ts`:
- Keep existing static entries and class schedule entries
- Add: `/about` (priority 0.7, weekly)
- Add: `/classes` (priority 0.8, weekly)
- Add: each `/classes/[slug]` from `siteConfig.classTypes` (priority 0.8, weekly)
- Add: `/location` (priority 0.7, monthly)
- Add: `/blog` (priority 0.6, weekly)
- Add: each `/blog/[slug]` from `getAllPosts()` (priority 0.5, monthly)

**Step 3: Commit**

```bash
git add app/robots.ts app/sitemap.ts
git commit -m "Add robots.ts and expand sitemap with all new pages"
```

---

### Task 12: Enhance Post-Booking Share Prompt

**Files:**
- Modify: `app/schedule/[classId]/signup/reservation-form.tsx`

**Step 1: Update the success state in ReservationForm**

Currently when `state.success` is true, the form shows a simple message and "Back to schedule" link. Enhance this to include a share prompt.

The reservation form needs access to the class name and share URL. Two approaches:
- **Option A:** Pass `className` and `classUrl` as props to `ReservationForm`
- **Option B:** Include them in the server action response

Use Option A — add `className` and `shareUrl` props.

Update `app/schedule/[classId]/signup/page.tsx` to pass these new props:
```tsx
<ReservationForm classId={classId} className={classRow.name} shareUrl={classSignupUrl} />
```

Update the success block in `reservation-form.tsx` to show:
- Confirmation message (keep existing)
- "You're in! Bring a friend?" heading
- Share buttons (import and reuse `ShareClassSection` component)
- "Back to schedule" link

The `ReservationForm` component needs to import `ShareClassSection` and render it in the success state with a `sharePayload` built from the `className` and `shareUrl` props.

**Step 2: Commit**

```bash
git add app/schedule/\[classId\]/signup/reservation-form.tsx app/schedule/\[classId\]/signup/page.tsx
git commit -m "Add post-booking share prompt to reservation success state"
```

---

### Task 13: Update Schedule Page Metadata and Existing Pages

**Files:**
- Modify: `app/schedule/page.tsx`
- Modify: `app/schedule/[classId]/signup/page.tsx`

**Step 1: Update schedule page to use site config for metadata**

Update the metadata export in `app/schedule/page.tsx` to use `siteConfig.business.name` in the title and include location keywords. Also update the hardcoded "← Home" link to use the gym name.

**Step 2: Update signup page schema**

In `app/schedule/[classId]/signup/page.tsx`, update the Event schema's `location` and `organizer` to use `siteConfig.business` values instead of hardcoded strings:

```typescript
location: {
  "@type": "Place",
  name: siteConfig.business.name,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.business.address.street,
    addressLocality: siteConfig.business.address.city,
    addressRegion: siteConfig.business.address.state,
    postalCode: siteConfig.business.address.zip,
  },
},
organizer: {
  "@type": "Organization",
  name: siteConfig.business.name,
},
```

**Step 3: Commit**

```bash
git add app/schedule/page.tsx app/schedule/\[classId\]/signup/page.tsx
git commit -m "Update schedule and signup pages to use site config for metadata and schema"
```

---

### Task 14: Final Build Verification

**Files:** None (verification only)

**Step 1: Run the build**

Run: `npm run build`
Expected: Build succeeds. Note any warnings.

If there are TypeScript errors, fix them. Common issues:
- Missing `gray-matter` or `next-mdx-remote` types
- Import path issues
- Missing `generateStaticParams` return type

**Step 2: Run lint**

Run: `npm run lint`
Expected: No errors (warnings are OK)

**Step 3: Spot-check pages**

Run: `npm run dev`
Manually verify in browser:
- Homepage shows header, instructor preview, testimonials, footer
- `/about` renders story and instructor bios
- `/classes` shows class type cards
- `/classes/strength-conditioning` shows long description and neighborhood section
- `/location` shows address, hours, map, neighborhoods
- `/blog` shows post listing
- `/blog/welcome` renders MDX content
- `/schedule` still works with Supabase data
- View page source to verify JSON-LD schemas are present

**Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "Fix build issues from viable site build-out"
```

---

## Task Dependency Graph

```
Task 1 (site-config) ──┬── Task 2 (schema component)
                        ├── Task 3 (header/footer + layout + homepage) ──┐
                        ├── Task 4 (/about)                              │
                        ├── Task 5 (/classes)                            │
                        ├── Task 6 (/classes/[slug])                     │
                        ├── Task 7 (/location)                           │
                        └── Task 11 (robots + sitemap) ──────────────────┤
                                                                         │
Task 8 (blog infra) ──── Task 9 (/blog) ── Task 10 (/blog/[slug]) ─────┤
                                                                         │
Task 12 (post-booking share) ───────────────────────────────────────────┤
Task 13 (update existing pages) ────────────────────────────────────────┤
                                                                         │
                                                                         └── Task 14 (build verification)
```

**Parallelizable groups after Task 1:**
- Group A: Tasks 2, 4, 5, 6, 7 (independent new pages)
- Group B: Task 8 → 9 → 10 (blog, sequential)
- Group C: Tasks 3, 12, 13 (modify existing files, do sequentially)
- Task 11 depends on Tasks 8-10 (needs blog posts for sitemap)
- Task 14 runs last
