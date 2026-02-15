# Admin Color Scheme & UI Readability — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply a warm stone admin palette and fix readability issues across the admin dashboard.

**Architecture:** CSS variable overrides scoped via `.admin-theme` class. Component-level class changes for badges, feedback messages, tables, tabs, and empty states. No shadcn source files modified.

**Tech Stack:** Tailwind CSS 4, shadcn/ui CSS variables

---

### Task 1: Add admin theme CSS and apply to admin page

**Files:**
- Modify: `app/globals.css`
- Modify: `app/admin/page.tsx`

**Step 1: Add `.admin-theme` block to `app/globals.css`**

Add after the `:root` block (after line 48), before `@theme inline`:

```css
/* Admin dashboard — warm stone palette */
.admin-theme {
  --background: #f5f5f4;
  --foreground: #1c1917;
  --card: #fafaf9;
  --card-foreground: #1c1917;
  --popover: #fafaf9;
  --popover-foreground: #1c1917;
  --muted: #e7e5e4;
  --muted-foreground: #78716c;
  --secondary: #e7e5e4;
  --secondary-foreground: #1c1917;
  --accent-foreground: #1c1917;
  --border: #d6d3d1;
  --input: #d6d3d1;
}
```

**Step 2: Apply `admin-theme` class to admin page wrapper**

In `app/admin/page.tsx`, change both wrapper divs (the login view on line 17 and the authed view on line 60) from:

```tsx
<div className="min-h-screen bg-[var(--background)]">
```

to:

```tsx
<div className="admin-theme min-h-screen bg-[var(--background)]">
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Successful build.

**Step 4: Commit**

```bash
git add app/globals.css app/admin/page.tsx
git commit -m "Add admin-theme stone palette and apply to admin page"
```

---

### Task 2: Fix tab active state with burnt orange underline

**Files:**
- Modify: `app/admin/admin-tabs.tsx`

**Step 1: Switch TabsList to `variant="line"` and style active tab**

In `app/admin/admin-tabs.tsx`, change the TabsList from:

```tsx
<TabsList>
```

to:

```tsx
<TabsList variant="line" className="border-b border-[var(--border)]">
```

The shadcn tabs component already supports `variant="line"` which renders an underline on the active tab using `after:bg-foreground`. To make the underline burnt orange instead of foreground-colored, add a class override on each TabsTrigger:

```tsx
<TabsTrigger value="classes" className="data-[state=active]:after:bg-[var(--primary)]">Classes</TabsTrigger>
<TabsTrigger value="bookings" className="data-[state=active]:after:bg-[var(--primary)]">Bookings</TabsTrigger>
<TabsTrigger value="email" className="data-[state=active]:after:bg-[var(--primary)]">Email</TabsTrigger>
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add app/admin/admin-tabs.tsx
git commit -m "Use line-style tabs with burnt orange active underline"
```

---

### Task 3: Fix status badges with semantic colors

**Files:**
- Modify: `app/admin/bookings-tab.tsx`

**Step 1: Replace hard-coded badge colors**

In `app/admin/bookings-tab.tsx`, find the Badge on line 110:

```tsx
<Badge variant={b.status === "confirmed" ? "default" : "secondary"} className={b.status === "confirmed" ? "bg-green-600" : ""}>
  {b.status}
</Badge>
```

Replace with:

```tsx
<Badge
  variant="secondary"
  className={
    b.status === "confirmed"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-stone-100 text-stone-500 border-stone-200"
  }
>
  {b.status}
</Badge>
```

This gives confirmed bookings a soft green badge and cancelled bookings a muted stone badge. Both are easy to read without being loud.

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add app/admin/bookings-tab.tsx
git commit -m "Use semantic badge colors: soft green for confirmed, muted for cancelled"
```

---

### Task 4: Fix feedback messages with background pills

**Files:**
- Modify: `app/admin/add-class-form.tsx`
- Modify: `app/admin/email-tab.tsx`
- Modify: `app/admin/classes-tab.tsx`
- Modify: `app/admin/bookings-tab.tsx`

**Step 1: Update feedback in `app/admin/add-class-form.tsx`**

Find lines 168-171:

```tsx
{state.message && (
  <p className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
    {state.message}
  </p>
)}
```

Replace with:

```tsx
{state.message && (
  <p className={`text-sm rounded-md px-3 py-2 ${state.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
    {state.message}
  </p>
)}
```

**Step 2: Update feedback in `app/admin/email-tab.tsx`**

Find lines 73-77:

```tsx
{state.message && (
  <p className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
    {state.message}
  </p>
)}
```

Replace with the same pattern:

```tsx
{state.message && (
  <p className={`text-sm rounded-md px-3 py-2 ${state.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
    {state.message}
  </p>
)}
```

**Step 3: Update error message in `app/admin/classes-tab.tsx`**

Find line 158:

```tsx
<p className="text-sm text-red-600">{deleteError}</p>
```

Replace with:

```tsx
<p className="text-sm rounded-md px-3 py-2 bg-red-50 text-red-700">{deleteError}</p>
```

**Step 4: Update error message in `app/admin/bookings-tab.tsx`**

Find line 139:

```tsx
<p className="text-sm text-red-600">{cancelError}</p>
```

Replace with:

```tsx
<p className="text-sm rounded-md px-3 py-2 bg-red-50 text-red-700">{cancelError}</p>
```

**Step 5: Verify build**

Run: `npm run build`

**Step 6: Commit**

```bash
git add app/admin/add-class-form.tsx app/admin/email-tab.tsx app/admin/classes-tab.tsx app/admin/bookings-tab.tsx
git commit -m "Use background pills for success/error feedback messages"
```

---

### Task 5: Improve table readability and empty states

**Files:**
- Modify: `app/admin/classes-tab.tsx`
- Modify: `app/admin/bookings-tab.tsx`

**Step 1: Add alternating row tinting in `app/admin/classes-tab.tsx`**

On each `<TableRow key={c.id}>` inside the map (line 95), add the even-row class:

```tsx
<TableRow key={c.id} className="even:bg-stone-50/50">
```

**Step 2: Fix empty state in `app/admin/classes-tab.tsx`**

Change line 70:

```tsx
<p className="text-sm text-[var(--muted)]">No upcoming classes. Add one to get started.</p>
```

to:

```tsx
<p className="py-8 text-center text-base text-muted-foreground">No upcoming classes. Add one to get started.</p>
```

**Step 3: Add alternating row tinting in `app/admin/bookings-tab.tsx`**

On each `<TableRow key={b.id}>` inside the map (line 103), add:

```tsx
<TableRow key={b.id} className="even:bg-stone-50/50">
```

**Step 4: Fix empty state in `app/admin/bookings-tab.tsx`**

Change line 75:

```tsx
<p className="text-sm text-[var(--muted)]">No bookings found.</p>
```

to:

```tsx
<p className="py-8 text-center text-base text-muted-foreground">No bookings found.</p>
```

**Step 5: Verify build**

Run: `npm run build`

**Step 6: Commit**

```bash
git add app/admin/classes-tab.tsx app/admin/bookings-tab.tsx
git commit -m "Add alternating row tinting and improved empty states"
```

---

### Task 6: Final visual verification

**Step 1: Run dev server**

Run: `npm run dev`

**Step 2: Visual checklist (browser at localhost:3000/admin)**

1. Admin page background is stone-100 (`#f5f5f4`), visually distinct from public page beige
2. Dialogs and cards use stone-50 (`#fafaf9`) — slightly lighter than the background
3. Tabs show line-style with burnt orange underline on active tab
4. Class table has alternating row tinting
5. Booking "confirmed" badge is soft green (green-100 bg, green-700 text)
6. Booking "cancelled" badge is muted stone
7. Success messages show as green pill (green-50 bg)
8. Error messages show as red pill (red-50 bg)
9. Empty states are centered, larger text, with vertical breathing room
10. All text is easy to read — no contrast issues

**Step 3: Production build**

Run: `npm run build`
Expected: Successful build.

**Step 4: Commit if fixes needed**

```bash
git add -A
git commit -m "Fix visual issues from admin color/UI review"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Admin theme CSS + apply to page | globals.css, page.tsx |
| 2 | Line-style tabs with orange underline | admin-tabs.tsx |
| 3 | Semantic badge colors | bookings-tab.tsx |
| 4 | Feedback message pills | add-class-form.tsx, email-tab.tsx, classes-tab.tsx, bookings-tab.tsx |
| 5 | Table row tinting + empty states | classes-tab.tsx, bookings-tab.tsx |
| 6 | Visual verification | Manual |
