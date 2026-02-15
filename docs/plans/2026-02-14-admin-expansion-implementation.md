# Phase 1B: Admin Expansion + shadcn/ui — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the admin dashboard into a tabbed interface with class CRUD, booking management, and email broadcast, powered by shadcn/ui components.

**Architecture:** Server component fetches data, passes to client-side tabbed UI. All mutations go through auth-gated server actions using the Supabase service-role client. shadcn/ui provides accessible, Tailwind-native components for admin UI only.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, Supabase, Resend

---

### Task 1: Install and configure shadcn/ui

**Files:**
- Modify: `package.json`
- Modify: `app/globals.css`
- Modify: `tsconfig.json`
- Create: `components.json` (shadcn config)
- Create: `lib/utils.ts` (cn utility)
- Create: `components/ui/` (component directory)

**Step 1: Install shadcn/ui dependencies**

Run: `npx shadcn@latest init`

When prompted:
- Style: New York
- Base color: Stone
- CSS variables: Yes

This creates `components.json`, `lib/utils.ts`, and updates `globals.css` with CSS variables.

**Step 2: Map theme variables**

After init, edit `app/globals.css` to merge shadcn's CSS variables with the existing theme. Keep the existing `:root` variables (`--background: #faf8f5`, `--foreground: #1a1f16`, `--accent: #c45c26`, `--muted: #5c6b52`) and map them to shadcn's variable names so components inherit the gym's brand colors.

The key mappings:
- `--primary` → `--accent` (#c45c26) so buttons match the burnt orange
- `--background` → keep #faf8f5 warm beige
- `--foreground` → keep #1a1f16 dark forest green
- `--muted` and `--muted-foreground` → sage green tones

**Step 3: Install required components**

Run each:
```bash
npx shadcn@latest add button
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add label
npx shadcn@latest add badge
npx shadcn@latest add tabs
npx shadcn@latest add card
```

Note: We skip Toast for now — we can add it later if needed. Simple inline status messages (like the existing pattern) are sufficient.

**Step 4: Verify build**

Run: `npm run build`
Expected: Successful build, no errors.

**Step 5: Commit**

```bash
git add -A
git commit -m "Add shadcn/ui with Button, Table, Dialog, Input, Textarea, Select, Label, Badge, Tabs, Card"
```

---

### Task 2: Database migration — add cancelled_at and RLS for email_signups

**Files:**
- Create: `docs/supabase-phase1b.sql`

**Step 1: Write the migration SQL**

Create `docs/supabase-phase1b.sql`:

```sql
-- Phase 1B: Admin expansion (run in Supabase SQL Editor)

-- Add cancelled_at to bookings for soft-cancel tracking
alter table bookings add column if not exists cancelled_at timestamptz;

-- RLS for email_signups (service role needs to read for broadcast)
-- email_signups table should already exist; ensure RLS is enabled
alter table email_signups enable row level security;

-- Service role can read email_signups (for broadcast feature)
create policy "Allow service role read email_signups" on email_signups
  for select using (auth.role() = 'service_role');

-- Index for filtering bookings by status
create index if not exists idx_bookings_status on bookings(status);
```

**Step 2: Commit**

```bash
git add docs/supabase-phase1b.sql
git commit -m "Add Phase 1B migration: cancelled_at column and email_signups RLS"
```

**Step 3: Run migration**

Run the SQL in the Supabase dashboard SQL Editor. This is a manual step — the engineer should run it against their Supabase project before proceeding.

---

### Task 3: New server actions — updateClass, deleteClass

**Files:**
- Modify: `app/actions.ts`

**Step 1: Add updateClass action**

Add after the existing `addClass` action (after line 148 in `app/actions.ts`):

```typescript
export async function updateClass(prevState: AddClassState, formData: FormData): Promise<AddClassState> {
  const { hasAdminSession } = await import("@/lib/admin-auth");
  if (!(await hasAdminSession())) {
    return { message: "Session expired. Please log in again.", success: false };
  }

  const classId = formData.get("class_id")?.toString();
  const name = formData.get("name")?.toString()?.trim();
  const type = formData.get("type")?.toString()?.trim();
  const instructor = formData.get("instructor")?.toString()?.trim();
  const classDate = formData.get("class_date")?.toString();
  const classTime = formData.get("class_time")?.toString();
  const durationMinutes = parseInt(formData.get("duration_minutes")?.toString() ?? "60", 10);
  const capacity = parseInt(formData.get("capacity")?.toString() ?? "12", 10);
  const priceDollars = parseFloat(formData.get("price_dollars")?.toString() ?? "35");
  const priceCents = Math.round(priceDollars * 100);
  const description = formData.get("description")?.toString()?.trim() ?? null;

  if (!classId || !name || !type || !instructor || !classDate || !classTime) {
    return { message: "Please fill in all required fields.", success: false };
  }

  const startTime = new Date(`${classDate}T${classTime}`);
  if (Number.isNaN(startTime.getTime())) {
    return { message: "Invalid date or time.", success: false };
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("classes")
    .update({
      name,
      type,
      instructor,
      start_time: startTime.toISOString(),
      duration_minutes: durationMinutes,
      capacity,
      price_cents: priceCents,
      description,
    })
    .eq("id", classId);

  if (error) {
    console.error("Update class error:", error);
    return { message: "Failed to update class. Try again.", success: false };
  }

  revalidatePath("/admin");
  revalidatePath("/schedule");
  return { message: "Class updated.", success: true };
}
```

**Step 2: Add deleteClass action**

Add after `updateClass`:

```typescript
export async function deleteClass(classId: string): Promise<{ message: string; success: boolean }> {
  const { hasAdminSession } = await import("@/lib/admin-auth");
  if (!(await hasAdminSession())) {
    return { message: "Session expired. Please log in again.", success: false };
  }

  if (!classId) {
    return { message: "Missing class ID.", success: false };
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  const { error } = await supabase.from("classes").delete().eq("id", classId);

  if (error) {
    console.error("Delete class error:", error);
    return { message: "Failed to delete class. Try again.", success: false };
  }

  revalidatePath("/admin");
  revalidatePath("/schedule");
  return { message: "Class deleted.", success: true };
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Successful build.

**Step 4: Commit**

```bash
git add app/actions.ts
git commit -m "Add updateClass and deleteClass server actions"
```

---

### Task 4: New server actions — cancelBooking, getSubscribers, sendBroadcast

**Files:**
- Modify: `app/actions.ts`
- Modify: `lib/resend.ts`

**Step 1: Add cancelBooking action to `app/actions.ts`**

```typescript
export async function cancelBooking(bookingId: string): Promise<{ message: string; success: boolean }> {
  const { hasAdminSession } = await import("@/lib/admin-auth");
  if (!(await hasAdminSession())) {
    return { message: "Session expired. Please log in again.", success: false };
  }

  if (!bookingId) {
    return { message: "Missing booking ID.", success: false };
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("id", bookingId);

  if (error) {
    console.error("Cancel booking error:", error);
    return { message: "Failed to cancel booking. Try again.", success: false };
  }

  revalidatePath("/admin");
  return { message: "Booking cancelled.", success: true };
}
```

**Step 2: Add sendBroadcast action to `app/actions.ts`**

```typescript
export async function sendBroadcast(
  prevState: { message: string; success: boolean },
  formData: FormData
): Promise<{ message: string; success: boolean }> {
  const { hasAdminSession } = await import("@/lib/admin-auth");
  if (!(await hasAdminSession())) {
    return { message: "Session expired. Please log in again.", success: false };
  }

  const subject = formData.get("subject")?.toString()?.trim();
  const body = formData.get("body")?.toString()?.trim();

  if (!subject || !body) {
    return { message: "Subject and body are required.", success: false };
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  const { data: subscribers, error: fetchError } = await supabase
    .from("email_signups")
    .select("email");

  if (fetchError || !subscribers?.length) {
    return { message: fetchError ? "Failed to fetch subscribers." : "No subscribers found.", success: false };
  }

  const { sendBroadcastEmail } = await import("@/lib/resend");
  const result = await sendBroadcastEmail({
    emails: subscribers.map((s) => s.email),
    subject,
    body,
  });

  if (!result.ok) {
    return { message: `Failed to send: ${result.error}`, success: false };
  }

  revalidatePath("/admin");
  return { message: `Email sent to ${subscribers.length} subscriber${subscribers.length === 1 ? "" : "s"}.`, success: true };
}
```

**Step 3: Add sendBroadcastEmail to `lib/resend.ts`**

Add after the existing `sendReservationConfirmation` function:

```typescript
export type SendBroadcastParams = {
  emails: string[];
  subject: string;
  body: string;
};

export async function sendBroadcastEmail(params: SendBroadcastParams) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set; skipping broadcast");
    return { ok: false as const, error: "Email not configured" };
  }

  const { emails, subject, body } = params;
  const htmlBody = body.split("\n").map((line) => (line.trim() ? `<p>${line}</p>` : "")).join("");

  try {
    const { error } = await resend.batch.send(
      emails.map((to) => ({
        from: FROM_EMAIL,
        to,
        subject,
        html: htmlBody,
      }))
    );

    if (error) {
      console.error("Resend broadcast error:", error);
      return { ok: false as const, error: error.message };
    }
    return { ok: true as const };
  } catch (err) {
    console.error("Broadcast send error:", err);
    return { ok: false as const, error: "Unexpected error sending email" };
  }
}
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Successful build.

**Step 5: Commit**

```bash
git add app/actions.ts lib/resend.ts
git commit -m "Add cancelBooking and sendBroadcast server actions"
```

---

### Task 5: Restructure admin page with Tabs layout

**Files:**
- Modify: `app/admin/page.tsx`
- Create: `app/admin/admin-tabs.tsx`

**Step 1: Create the admin tabs client component**

Create `app/admin/admin-tabs.tsx` — a `"use client"` component that receives classes, bookings, and subscriber count as props and renders three tabs: Classes, Bookings, Email.

```typescript
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassesTab } from "./classes-tab";
import { BookingsTab } from "./bookings-tab";
import { EmailTab } from "./email-tab";

type ClassRow = {
  id: string;
  name: string;
  type: string;
  instructor: string;
  start_time: string;
  duration_minutes: number;
  capacity: number;
  price_cents: number;
  description: string | null;
};

type BookingRow = {
  id: string;
  class_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  status: string;
  created_at: string;
  classes: { name: string; start_time: string } | null;
};

type Props = {
  classes: ClassRow[];
  bookings: BookingRow[];
  subscriberCount: number;
};

export function AdminTabs({ classes, bookings, subscriberCount }: Props) {
  return (
    <Tabs defaultValue="classes">
      <TabsList>
        <TabsTrigger value="classes">Classes</TabsTrigger>
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
      </TabsList>
      <TabsContent value="classes">
        <ClassesTab classes={classes} />
      </TabsContent>
      <TabsContent value="bookings">
        <BookingsTab bookings={bookings} />
      </TabsContent>
      <TabsContent value="email">
        <EmailTab subscriberCount={subscriberCount} />
      </TabsContent>
    </Tabs>
  );
}
```

**Step 2: Update `app/admin/page.tsx`**

Rewrite the admin page server component to fetch classes, bookings, and subscriber count, then render the login form (if not authed) or the tabbed dashboard.

```typescript
import Link from "next/link";
import { hasAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@/lib/supabase/server";
import { AdminLoginForm } from "./admin-login-form";
import { AdminLogoutButton } from "./admin-logout-button";
import { AdminTabs } from "./admin-tabs";

export const metadata = {
  title: "Admin | Class schedule",
};

export default async function AdminPage() {
  const isAdmin = await hasAdminSession();

  let classes: any[] = [];
  let bookings: any[] = [];
  let subscriberCount = 0;

  if (isAdmin) {
    const adminSupabase = createAdminClient();

    const { data: classData } = await adminSupabase
      .from("classes")
      .select("id, name, type, instructor, start_time, duration_minutes, capacity, price_cents, description")
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true });

    const { data: bookingData } = await adminSupabase
      .from("bookings")
      .select("id, class_id, customer_name, customer_email, customer_phone, status, created_at, classes(name, start_time)")
      .order("created_at", { ascending: false });

    const { count } = await adminSupabase
      .from("email_signups")
      .select("id", { count: "exact", head: true });

    classes = classData ?? [];
    bookings = bookingData ?? [];
    subscriberCount = count ?? 0;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <div>
            <Link href="/schedule" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              ← Schedule
            </Link>
            <h1 className="mt-2 text-xl font-bold">Admin</h1>
            <p className="text-sm text-[var(--muted)]">Manage classes, bookings, and email.</p>
          </div>
          {isAdmin && <AdminLogoutButton />}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {!isAdmin ? (
          <AdminLoginForm />
        ) : (
          <AdminTabs classes={classes} bookings={bookings} subscriberCount={subscriberCount} />
        )}
      </main>
    </div>
  );
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Will fail because ClassesTab, BookingsTab, EmailTab don't exist yet. That's expected — we build those in the next tasks. Verify no syntax errors by running `npx tsc --noEmit` and checking only for the missing module errors.

**Step 4: Commit**

```bash
git add app/admin/page.tsx app/admin/admin-tabs.tsx
git commit -m "Restructure admin page with tabbed layout (tabs shell)"
```

---

### Task 6: Classes tab — table with add, edit, delete

**Files:**
- Create: `app/admin/classes-tab.tsx`
- Modify: `app/admin/add-class-form.tsx` (adapt for Dialog use and edit mode)

**Step 1: Create `app/admin/classes-tab.tsx`**

This component renders:
- An "Add class" Button that opens a Dialog containing the AddClassForm
- A Table of all classes with Edit and Delete actions
- Edit opens the same Dialog pre-filled with the class data
- Delete opens a confirmation Dialog

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddClassForm } from "./add-class-form";
import { deleteClass } from "@/app/actions";

type ClassRow = {
  id: string;
  name: string;
  type: string;
  instructor: string;
  start_time: string;
  duration_minutes: number;
  capacity: number;
  price_cents: number;
  description: string | null;
};

export function ClassesTab({ classes }: { classes: ClassRow[] }) {
  const [addOpen, setAddOpen] = useState(false);
  const [editClass, setEditClass] = useState<ClassRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClassRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await deleteClass(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Upcoming classes</h2>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>Add class</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add class</DialogTitle>
            </DialogHeader>
            <AddClassForm onSuccess={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {!classes.length ? (
        <p className="text-sm text-[var(--muted)]">No upcoming classes. Add one above.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((c) => {
              const start = new Date(c.start_time);
              const dateStr = start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
              const timeStr = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell><Badge variant="secondary">{c.type}</Badge></TableCell>
                  <TableCell>{c.instructor}</TableCell>
                  <TableCell>{dateStr} · {timeStr}</TableCell>
                  <TableCell>${(c.price_cents / 100).toFixed(0)}</TableCell>
                  <TableCell>{c.capacity}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditClass(c)}>Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteTarget(c)}>Delete</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editClass} onOpenChange={(open) => !open && setEditClass(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit class</DialogTitle>
          </DialogHeader>
          {editClass && (
            <AddClassForm
              editMode
              classData={editClass}
              onSuccess={() => setEditClass(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete class</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--muted)]">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This will also cancel all bookings for this class.
          </p>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

**Step 2: Update `app/admin/add-class-form.tsx` to support edit mode**

Modify the form to accept optional `editMode`, `classData`, and `onSuccess` props. When in edit mode, pre-fill all fields and call `updateClass` instead of `addClass`. Use shadcn/ui Input, Select, Textarea, Label, and Button components.

Key changes:
- Accept props: `editMode?: boolean`, `classData?: ClassRow`, `onSuccess?: () => void`
- Use `updateClass` action when `editMode` is true, `addClass` when false
- Include a hidden `class_id` input when editing
- Pre-fill all fields from `classData` using `defaultValue`
- Call `onSuccess?.()` when the action succeeds (check state in a useEffect)
- Replace raw HTML inputs with shadcn `Input`, `Label`, `Button`, `Textarea` components
- Replace raw HTML select with shadcn `select` (native HTML select is fine here since shadcn Select is more complex than needed for simple dropdowns)

**Step 3: Verify build**

Run: `npm run build`
Expected: May still fail if BookingsTab and EmailTab don't exist. Create placeholder files if needed to verify the classes tab works.

**Step 4: Commit**

```bash
git add app/admin/classes-tab.tsx app/admin/add-class-form.tsx
git commit -m "Add Classes tab with table, add/edit/delete dialogs"
```

---

### Task 7: Bookings tab — table with filter and cancel

**Files:**
- Create: `app/admin/bookings-tab.tsx`

**Step 1: Create `app/admin/bookings-tab.tsx`**

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cancelBooking } from "@/app/actions";

type BookingRow = {
  id: string;
  class_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  status: string;
  created_at: string;
  classes: { name: string; start_time: string } | null;
};

export function BookingsTab({ bookings }: { bookings: BookingRow[] }) {
  const [filterClassId, setFilterClassId] = useState<string>("all");
  const [cancelTarget, setCancelTarget] = useState<BookingRow | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Unique classes for filter dropdown
  const classOptions = Array.from(
    new Map(bookings.map((b) => [b.class_id, b.classes?.name ?? "Unknown"])).entries()
  );

  const filtered = filterClassId === "all"
    ? bookings
    : bookings.filter((b) => b.class_id === filterClassId);

  async function handleCancel() {
    if (!cancelTarget) return;
    setCancelLoading(true);
    await cancelBooking(cancelTarget.id);
    setCancelLoading(false);
    setCancelTarget(null);
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Bookings</h2>
        <select
          value={filterClassId}
          onChange={(e) => setFilterClassId(e.target.value)}
          className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm"
        >
          <option value="all">All classes</option>
          {classOptions.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>

      {!filtered.length ? (
        <p className="text-sm text-[var(--muted)]">No bookings yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => {
              const classDate = b.classes?.start_time
                ? new Date(b.classes.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "—";
              return (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.customer_name}</TableCell>
                  <TableCell>{b.customer_email}</TableCell>
                  <TableCell>{b.customer_phone ?? "—"}</TableCell>
                  <TableCell>{b.classes?.name ?? "Unknown"}</TableCell>
                  <TableCell>{classDate}</TableCell>
                  <TableCell>
                    <Badge variant={b.status === "confirmed" ? "default" : "secondary"}>
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {b.status === "confirmed" && (
                      <Button variant="outline" size="sm" onClick={() => setCancelTarget(b)}>
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Cancel confirmation dialog */}
      <Dialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel booking</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--muted)]">
            Cancel <strong>{cancelTarget?.customer_name}</strong>&apos;s booking for <strong>{cancelTarget?.classes?.name}</strong>?
          </p>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setCancelTarget(null)}>Keep</Button>
            <Button variant="destructive" onClick={handleCancel} disabled={cancelLoading}>
              {cancelLoading ? "Cancelling…" : "Cancel booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: May still need EmailTab placeholder.

**Step 3: Commit**

```bash
git add app/admin/bookings-tab.tsx
git commit -m "Add Bookings tab with table, filter, and cancel"
```

---

### Task 8: Email tab — compose and send broadcast

**Files:**
- Create: `app/admin/email-tab.tsx`

**Step 1: Create `app/admin/email-tab.tsx`**

```typescript
"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sendBroadcast } from "@/app/actions";

export function EmailTab({ subscriberCount }: { subscriberCount: number }) {
  const [state, formAction] = useActionState(sendBroadcast, { message: "", success: false });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPendingFormData(fd);
    setConfirmOpen(true);
  }

  function handleConfirmSend() {
    if (pendingFormData) {
      formAction(pendingFormData);
    }
    setConfirmOpen(false);
    setPendingFormData(null);
  }

  return (
    <div className="mt-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Email broadcast</h2>
        <p className="text-sm text-[var(--muted)]">
          Send an email to all {subscriberCount} subscriber{subscriberCount === 1 ? "" : "s"}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="body">Body</Label>
          <Textarea id="body" name="body" required rows={8} className="mt-1" />
        </div>
        <Button type="submit" disabled={subscriberCount === 0}>
          Send to {subscriberCount} subscriber{subscriberCount === 1 ? "" : "s"}
        </Button>
        {state.message && (
          <p className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
            {state.message}
          </p>
        )}
      </form>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm send</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--muted)]">
            Send this email to <strong>{subscriberCount}</strong> subscriber{subscriberCount === 1 ? "" : "s"}? This cannot be undone.
          </p>
          <div className="mt-2 rounded-lg border border-stone-200 p-3 text-sm">
            <p className="font-medium">{pendingFormData?.get("subject")?.toString()}</p>
            <p className="mt-1 text-[var(--muted)] whitespace-pre-wrap">{pendingFormData?.get("body")?.toString()}</p>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmSend}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Successful build — all tabs now exist.

**Step 3: Commit**

```bash
git add app/admin/email-tab.tsx
git commit -m "Add Email tab with broadcast compose and send"
```

---

### Task 9: Full integration test and visual review

**Files:** None (manual verification)

**Step 1: Run the dev server**

Run: `npm run dev`

**Step 2: Manual verification checklist**

Test each feature in the browser at `http://localhost:3000/admin`:

1. **Login** — enter admin password, verify redirect to dashboard
2. **Tabs** — click Classes, Bookings, Email tabs, verify each renders
3. **Add class** — click "Add class" button, fill form, submit, verify class appears in table
4. **Edit class** — click "Edit" on a class, modify a field, submit, verify change
5. **Delete class** — click "Delete", confirm in dialog, verify class removed
6. **Bookings** — verify bookings table shows data (create a test booking via `/schedule` first if needed)
7. **Filter bookings** — use dropdown to filter by class
8. **Cancel booking** — click "Cancel", confirm, verify status changes to "cancelled"
9. **Email** — verify subscriber count shows, fill subject/body, click send, verify confirmation dialog, confirm send
10. **Responsive** — check admin page at mobile and tablet widths
11. **Logout** — click "Log out", verify redirect to login

**Step 3: Production build**

Run: `npm run build`
Expected: Successful build, no errors.

**Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "Fix integration issues from admin expansion review"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Install/configure shadcn/ui | package.json, globals.css, components.json, lib/utils.ts, components/ui/* |
| 2 | Database migration | docs/supabase-phase1b.sql |
| 3 | Server actions: updateClass, deleteClass | app/actions.ts |
| 4 | Server actions: cancelBooking, sendBroadcast | app/actions.ts, lib/resend.ts |
| 5 | Admin tabs layout | app/admin/page.tsx, app/admin/admin-tabs.tsx |
| 6 | Classes tab | app/admin/classes-tab.tsx, app/admin/add-class-form.tsx |
| 7 | Bookings tab | app/admin/bookings-tab.tsx |
| 8 | Email tab | app/admin/email-tab.tsx |
| 9 | Integration test | Manual verification |
