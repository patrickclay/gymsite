# Viable Gym Site Build-Out: Design Document

**Date:** 2026-02-15
**Status:** Approved
**Location:** Lilburn, GA (serving Stone Mountain, Tucker, Norcross, Snellville, Lawrenceville)

## Context

The site has a working MVP: landing page, class schedule, booking flow, admin dashboard with CRUD, email broadcasts, and AI-generated class descriptions. It needs to become a viable, launchable site that is best-in-class for local SEO, optimized for social sharing, and easy to manage.

## Decisions

- **Content management:** Config-driven (`lib/site-config.ts`). Developer edits content files and deploys. Owner manages classes/bookings/emails via admin dashboard. CMS can be layered in later.
- **Payments:** Deferred. Free reservations continue. Stripe integration is a future phase. `price_cents` column is ready.
- **Blog:** Included. MDX files in `content/blog/`. Developer writes posts. AI can draft them.

## Architecture: Site Content Config

All static site content lives in `lib/site-config.ts`:

```
lib/site-config.ts
├── business (name, address, phone, email, hours, social links, geo coords)
├── seo (default title template, description, keywords, OG image path)
├── hero (headline, subheadline, CTA text)
├── classTypes[] (name, slug, shortDescription, icon, longDescription)
├── instructors[] (name, bio, photo, specialties, slug)
├── testimonials[] (quote, name, memberSince)
├── neighborhoods[] (name, description, distanceFromGym, driveTime)
└── footer (tagline, legal text)
```

Dynamic data (classes, bookings, subscribers) stays in Supabase.

## New Pages

| Route | Purpose | SEO Target |
|-------|---------|------------|
| `/about` | Studio story, mission, instructor bios | Trust building, brand keywords |
| `/classes` | Class types overview | "fitness classes Lilburn GA" |
| `/classes/[slug]` | Individual class type (e.g., `/classes/yoga`) | "yoga classes Lilburn GA", "yoga near Stone Mountain" |
| `/location` | Map, hours, directions, neighborhoods | "gym near me", neighborhood names |
| `/blog` | Blog listing | Long-tail local keywords |
| `/blog/[slug]` | Blog post detail | Topical authority, local content |

## Enhanced Existing Pages

| Route | Enhancement |
|-------|-------------|
| `/` | Instructor preview, testimonials, LocalBusiness schema, use site-config |
| `/layout.tsx` | Site header/nav, default meta from site-config |
| `/schedule` | Class type filter, enhanced Event schema |
| `/schedule/[classId]/signup` | Post-booking share prompt ("You're in! Share with a friend") |
| `/sitemap.ts` | Include all new pages |

## New Components

| Component | Purpose |
|-----------|---------|
| `components/site-header.tsx` | Navigation bar across all pages |
| `components/site-footer.tsx` | Extracted from homepage, reusable |
| `components/local-business-schema.tsx` | Reusable LocalBusiness JSON-LD |
| `components/neighborhood-cta.tsx` | "Serving [neighborhoods]" section for class type pages |

## SEO Strategy

### Structured Data (JSON-LD)
- **Every page:** `LocalBusiness` with consistent NAP, geo coords, areaServed, hours
- **Class type pages:** `Service` schema
- **Schedule/signup pages:** `Event` schema (already exists, enhance)
- **Blog posts:** `Article` schema with author, datePublished, dateModified

### On-Page SEO
- Unique title and meta description per page using template: "[Page] | [Gym Name] - Fitness in Lilburn, GA"
- OG and Twitter Card meta on every page
- Canonical URLs
- `robots.txt` allowing all crawlers, pointing to sitemap
- Enhanced sitemap with all pages including class types and blog posts

### Neighborhood SEO
- `/classes/[slug]` pages include a "Serving [neighborhoods]" section
- Natural copy referencing nearby areas with drive times
- `/location` page has directions from each neighborhood
- `areaServed` in LocalBusiness schema lists all neighborhoods

## Social Sharing

### Per-Page OG Tags
- Homepage: Brand-level OG (gym name, tagline, hero image)
- Class type pages: "[Class Type] Classes in Lilburn, GA | [Gym Name]"
- Blog posts: Post title, excerpt, featured image
- Location: "[Gym Name] | Fitness Studio in Lilburn, GA"

### Post-Booking Share Prompt
After successful reservation, show celebratory section:
- "You're in! Bring a friend?"
- Same share buttons (Web Share API, copy link, X, Facebook, WhatsApp)
- Pre-filled text: "Just booked [Class Name] at [Gym Name]! Join me — [link]"

## Blog Architecture

- MDX files in `content/blog/` directory
- Frontmatter: title, description, date, author, tags, slug, featuredImage
- `/blog` listing page sorted by date
- `/blog/[slug]` detail page with Article schema
- Blog posts auto-included in sitemap
- OG/Twitter meta per post

## New Files Summary

```
lib/site-config.ts
components/site-header.tsx
components/site-footer.tsx
components/local-business-schema.tsx
components/neighborhood-cta.tsx
app/about/page.tsx
app/classes/page.tsx
app/classes/[slug]/page.tsx
app/location/page.tsx
app/blog/page.tsx
app/blog/[slug]/page.tsx
content/blog/ (directory for MDX posts)
public/robots.txt
```

## Modified Files Summary

```
app/page.tsx (instructors, testimonials, schema, site-config)
app/layout.tsx (header/nav, default meta)
app/schedule/page.tsx (filter, enhanced schema)
app/schedule/[classId]/signup/page.tsx (post-booking share)
app/sitemap.ts (new pages)
```

## Deferred to Future Phases

- Stripe payment integration
- CMS / visual editor (Sanity)
- Class packs and memberships
- Recurring class templates
- Instagram feed embed
- Referral system with tracking
- Google Business Profile setup guide
- Advanced analytics/reporting
