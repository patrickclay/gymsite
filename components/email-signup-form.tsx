"use client";

import { useActionState } from "react";
import { signupEmail } from "@/app/actions";

type Props = {
  buttonText?: string;
};

export function EmailSignupForm({ buttonText = "Stay in the Loop" }: Props) {
  const [state, formAction] = useActionState(signupEmail, { message: "", success: false });

  return (
    <div className="flex flex-col gap-3">
      <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:max-w-md">
        <input
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-3 text-[var(--foreground)] placeholder:text-stone-400 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
        />
        <button
          type="submit"
          className="rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#c45c26" }}
        >
          {buttonText}
        </button>
      </form>
      {state.message && (
        <p
          className={`text-sm ${state.success ? "text-[var(--muted)]" : "text-red-600"}`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
