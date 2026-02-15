"use client";

import { clearAdminSessionAction } from "@/app/actions";

export function AdminLogoutButton() {
  return (
    <form action={clearAdminSessionAction}>
      <button
        type="submit"
        className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        Log out
      </button>
    </form>
  );
}
