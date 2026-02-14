"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createReservation } from "@/app/actions";

export function ReservationForm({ classId }: { classId: string }) {
  const [state, formAction] = useActionState(createReservation, {
    message: "",
    success: false,
  });

  if (state.success) {
    return (
      <div className="mt-4 rounded-xl border border-stone-200/60 bg-white/80 p-6">
        <p className="text-[var(--foreground)] font-medium">{state.message}</p>
        <Link
          href="/schedule"
          className="mt-4 inline-block rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#c45c26" }}
        >
          Back to schedule
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-4">
      <input type="hidden" name="classId" value={classId} />
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)]">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-[var(--foreground)]">
          Phone <span className="text-[var(--muted)]">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
        />
      </div>
      <button
        type="submit"
        className="mt-2 rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#c45c26" }}
      >
        Reserve your spot
      </button>
      {state.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}
    </form>
  );
}
