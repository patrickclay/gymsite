import Link from "next/link";
import { hasAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminLoginForm } from "./admin-login-form";
import { AdminLogoutButton } from "./admin-logout-button";
import { AdminTabs } from "./admin-tabs";

export const metadata = {
  title: "Admin | Dashboard",
};

export default async function AdminPage() {
  const isAdmin = await hasAdminSession();

  if (!isAdmin) {
    return (
      <div className="admin-theme min-h-screen bg-[var(--background)]">
        <header className="border-b border-stone-200/60">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <Link href="/schedule" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              &larr; Schedule
            </Link>
            <h1 className="mt-2 text-xl font-bold">Admin</h1>
            <p className="text-sm text-[var(--muted)]">Log in to manage classes, bookings, and email.</p>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">
          <AdminLoginForm />
        </main>
      </div>
    );
  }

  const supabase = createAdminClient();

  const [classesResult, bookingsResult, subscriberResult] = await Promise.all([
    supabase
      .from("classes")
      .select("id, name, type, instructor, description, start_time, duration_minutes, capacity, price_cents")
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true }),
    supabase
      .from("bookings")
      .select("id, class_id, customer_name, customer_email, customer_phone, status, created_at, classes(name, start_time)"),
    supabase
      .from("email_signups")
      .select("id", { count: "exact", head: true }),
  ]);

  const classes = classesResult.data ?? [];
  const subscriberCount = subscriberResult.count ?? 0;

  // Supabase returns the joined relation as an array; normalize to single object or null
  const bookings = (bookingsResult.data ?? []).map((b) => ({
    ...b,
    classes: Array.isArray(b.classes) ? b.classes[0] ?? null : b.classes ?? null,
  }));

  return (
    <div className="admin-theme min-h-screen bg-[var(--background)]">
      <header className="border-b border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <div>
            <Link href="/schedule" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              &larr; Schedule
            </Link>
            <h1 className="mt-2 text-xl font-bold">Admin</h1>
            <p className="text-sm text-[var(--muted)]">Manage classes, bookings, and email.</p>
          </div>
          <AdminLogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <AdminTabs classes={classes} bookings={bookings} subscriberCount={subscriberCount} />
      </main>
    </div>
  );
}
