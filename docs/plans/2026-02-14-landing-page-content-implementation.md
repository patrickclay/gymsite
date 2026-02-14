# Landing Page Content Rewrite — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite the landing page content using marketing psychology principles (empathy hooks, identity anchoring, co-creation) per the design doc at `docs/plans/2026-02-14-landing-page-content-design.md`.

**Architecture:** Single-file content rewrite of `app/page.tsx` plus minor prop change in the `EmailSignupForm` component. Adds one new section ("We Get It" bridge) between hero and class offerings. No new dependencies, no structural changes to the app.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4. All changes are JSX content and CSS classes.

---

### Task 1: Rewrite the Hero section

**Files:**
- Modify: `app/page.tsx:8-29` (hero section)

**Step 1: Replace the hero content**

Replace the entire `{/* Hero */}` `<header>` block (lines 8-29) with:

```tsx
{/* Hero */}
<header className="relative overflow-hidden border-b border-stone-200/60">
  <div className="absolute inset-0 bg-gradient-to-br from-stone-900/5 via-transparent to-transparent" />
  <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-32">
    <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
      Coming Soon &middot; Atlanta Area
    </p>
    <h1 className="max-w-3xl font-bold tracking-tight text-[var(--foreground)] text-4xl sm:text-5xl lg:text-6xl">
      You&apos;ve been looking for a fitness program that actually sees you.
    </h1>
    <p className="mt-6 max-w-xl text-lg text-[var(--muted)]">
      We spent 20+ years coaching in other people&apos;s spaces. Now we&apos;re building our own—and we&apos;re building it with you. A place where coaches know your name, your goals, and what you need to get there.
    </p>

    {/* Email capture - above fold */}
    <div className="mt-10">
      <EmailSignupForm buttonText="Be Part of It from Day One" />
    </div>
    <p className="mt-3 text-sm text-[var(--muted)]">
      Tell us your ideal schedule—early mornings, evenings, or weekends? We&apos;re designing this around your life.
    </p>
  </div>
</header>
```

**Step 2: Verify the build**

Run: `cd /Users/patrickboggs/projects/gymsite/.claude/worktrees/nice-chaplygin && npx next build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Rewrite hero section with empathy hook and future-self headline"
```

---

### Task 2: Add the "We Get It" bridge section

**Files:**
- Modify: `app/page.tsx` (insert new section after `</header>`, before `{/* Class offerings */}`)

**Step 1: Insert the bridge section**

Add this new section between the closing `</header>` tag and the `{/* Class offerings */}` comment:

```tsx
{/* We Get It - empathy bridge */}
<section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
  <div className="max-w-2xl">
    <p className="text-lg text-[var(--muted)] leading-relaxed">
      Maybe you&apos;ve tried the big-box classes where no one learns your name.
      Maybe you followed a cookie-cutter program that never met you where you are.
      Or maybe you&apos;ve been waiting because it feels like you need to already be fit just to walk through the door.
    </p>
    <p className="mt-6 text-lg font-medium text-[var(--foreground)] leading-relaxed">
      We spent 20 years coaching in spaces that weren&apos;t built for the people who needed them most. So we&apos;re building one that is.
    </p>
  </div>
</section>
```

**Step 2: Verify the build**

Run: `cd /Users/patrickboggs/projects/gymsite/.claude/worktrees/nice-chaplygin && npx next build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Add empathy bridge section between hero and class offerings"
```

---

### Task 3: Rewrite the class offerings section

**Files:**
- Modify: `app/page.tsx` (class offerings section)

**Step 1: Replace the class offerings content**

Replace the entire `{/* Class offerings */}` `<section>` block with:

```tsx
{/* Class offerings */}
<section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
    Three ways in. All of them yours.
  </h2>
  <p className="mt-2 text-[var(--muted)]">
    Every class is small enough that your coaches know your name by day one.
  </p>
  <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {[
      {
        title: "Strength & conditioning",
        desc: "Learn what your body can actually do when someone\u2019s paying attention. Real coaching, real progression\u2014from unsure to confident under the bar.",
      },
      {
        title: "Kickboxing & self-defense",
        desc: "Walk in carrying your day. Walk out carrying yourself differently. Empowering, challenging, and built around skills that stay with you.",
      },
      {
        title: "Somatic movement",
        desc: "The class no one expects to love\u2014and can\u2019t stop talking about. Psychology meets movement. Restore the connection between your mind and body.",
      },
    ].map(({ title, desc }) => (
      <div
        key={title}
        className="rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm"
      >
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="mt-2 text-[var(--muted)]">{desc}</p>
      </div>
    ))}
  </div>
</section>
```

**Step 2: Verify the build**

Run: `cd /Users/patrickboggs/projects/gymsite/.claude/worktrees/nice-chaplygin && npx next build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Rewrite class cards with outcome-first transformation language"
```

---

### Task 4: Rewrite the bottom CTA section

**Files:**
- Modify: `app/page.tsx` (email capture below fold section)

**Step 1: Replace the bottom CTA content**

Replace the entire `{/* Email capture - below fold */}` `<section>` block with:

```tsx
{/* The Invitation - bottom CTA */}
<section className="border-t border-stone-200/60 bg-stone-100/50">
  <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
      This isn&apos;t built yet. That&apos;s the point.
    </h2>
    <p className="mt-2 max-w-lg text-[var(--muted)]">
      Your input shapes the schedule, the classes, the culture. This isn&apos;t a newsletter—it&apos;s an invitation to build something with us.
    </p>
    <div className="mt-8">
      <EmailSignupForm buttonText="Count Me In" />
    </div>
    <p className="mt-3 text-sm text-[var(--muted)]">
      No spam. Just updates as we build this together.
    </p>
  </div>
</section>
```

**Step 2: Verify the build**

Run: `cd /Users/patrickboggs/projects/gymsite/.claude/worktrees/nice-chaplygin && npx next build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Rewrite bottom CTA with co-creation invitation language"
```

---

### Task 5: Update the footer

**Files:**
- Modify: `app/page.tsx` (footer section)

**Step 1: Replace the footer content**

Replace the entire `{/* Footer */}` `<footer>` block with:

```tsx
{/* Footer */}
<footer className="border-t border-stone-200/60 py-8">
  <div className="mx-auto max-w-6xl px-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm text-[var(--muted)]">
        Atlanta area &middot; Coming soon
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Founded by two coaches who&apos;d rather know your name than count your reps.
      </p>
    </div>
    <div className="flex gap-6">
      <Link href="#" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Instagram</Link>
      <Link href="#" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Facebook</Link>
    </div>
  </div>
</footer>
```

**Step 2: Verify the build**

Run: `cd /Users/patrickboggs/projects/gymsite/.claude/worktrees/nice-chaplygin && npx next build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Add founder tagline to footer for grounding"
```

---

### Task 6: Update metadata to match new content

**Files:**
- Modify: `app/layout.tsx:11-17` (metadata object)

**Step 1: Update the metadata**

Replace the `metadata` export with:

```tsx
export const metadata: Metadata = {
  title: "A Fitness Program That Actually Sees You | Coming Soon to Atlanta",
  description: "Small group fitness classes with real coaching. Strength, kickboxing, and somatic movement in an intimate setting where coaches know your name. Help us build it.",
  openGraph: {
    title: "A Fitness Program That Actually Sees You | Coming Soon to Atlanta",
    description: "Small group fitness with real coaching. Strength, kickboxing, somatic movement. We're building something special—and we're building it with you.",
  },
};
```

**Step 2: Verify the build**

Run: `cd /Users/patrickboggs/projects/gymsite/.claude/worktrees/nice-chaplygin && npx next build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "Update page metadata to match new empathy-first messaging"
```

---

### Task 7: Final visual review

**Step 1: Start dev server and verify**

Run: `cd /Users/patrickboggs/projects/gymsite/.claude/worktrees/nice-chaplygin && npx next dev`

Check that:
- Hero headline renders: "You've been looking for a fitness program that actually sees you."
- Bridge section appears between hero and class cards
- Class cards show transformation-first language
- Bottom CTA says "This isn't built yet. That's the point."
- Footer shows founder tagline
- Both email forms render with updated button text
- Page is responsive on mobile widths

**Step 2: Stop dev server and do final build check**

Run: `cd /Users/patrickboggs/projects/gymsite/.claude/worktrees/nice-chaplygin && npx next build`
Expected: Build succeeds, no warnings about content.
