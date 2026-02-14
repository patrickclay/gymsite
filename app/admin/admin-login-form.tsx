"use client";

import { useActionState } from "react";
import { verifyAdminPasswordAction } from "@/app/actions";

export function AdminLoginForm() {
  const [state, formAction] = useActionState(verifyAdminPasswordAction, { message: "" });

  return (
    <form action={formAction} className="rounded-xl border border-stone-200/60 bg-white/80 p-6 max-w-sm">
      <h2 className="text-lg font-semibold">Admin login</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">Enter the admin password to continue.</p>
      <div className="mt-4">
        <label htmlFor="adminPassword" className="block text-sm font-medium text-[var(--foreground)]">
          Password
        </label>
        <input
          id="adminPassword"
          name="adminPassword"
          type="password"
          required
          autoFocus
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-[var(--foreground)]"
        />
      </div>
      <button
        type="submit"
        className="mt-4 rounded-lg px-4 py-2 font-semibold text-white"
        style={{ backgroundColor: "#c45c26" }}
      >
        Log in
      </button>
      {state.message && (
        <p className="mt-3 text-sm text-red-600">{state.message}</p>
      )}
    </form>
  );
}
