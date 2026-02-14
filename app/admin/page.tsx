import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { AddClassForm } from "./add-class-form";
import { AdminLoginForm } from "./admin-login-form";
import { AdminLogoutButton } from "./admin-logout-button";

export const metadata = {
  title: "Admin | Class schedule",
};

export default async function AdminPage() {
  const isAdmin = await hasAdminSession();
  const supabase = createServerClient();
  const { data: classes } = await supabase
    .from("classes")
    .select("id, name, type, instructor, start_time, duration_minutes, capacity, price_cents")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <div>
            <Link href="/schedule" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              ← Schedule
            </Link>
            <h1 className="mt-2 text-xl font-bold">Admin</h1>
            <p className="text-sm text-[var(--muted)]">Add and manage classes.</p>
          </div>
          {isAdmin && <AdminLogoutButton />}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {!isAdmin ? (
          <div className="mb-10">
            <AdminLoginForm />
          </div>
        ) : (
          <div className="mb-10">
            <AddClassForm />
          </div>
        )}

        <h2 className="text-lg font-semibold">Upcoming classes</h2>
        {!classes?.length ? (
          <p className="mt-2 text-sm text-[var(--muted)]">
            {isAdmin ? "No upcoming classes. Add one above." : "No upcoming classes."}
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {classes.map((c) => {
              const start = new Date(c.start_time);
              const dateStr = start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
              const timeStr = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
              const price = (c.price_cents / 100).toFixed(0);
              return (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-stone-200/60 bg-white/80 px-4 py-3 text-sm"
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-[var(--muted)]">{c.type}</span>
                  <span className="text-[var(--muted)]">{c.instructor}</span>
                  <span>{dateStr} · {timeStr}</span>
                  <span>${price}</span>
                  <Link
                    href={`/schedule/${c.id}/signup`}
                    className="text-[var(--accent)] hover:underline"
                  >
                    View signup page
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
