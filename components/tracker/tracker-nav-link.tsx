"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";

export function TrackerNavLink() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!loggedIn) return null;

  return (
    <Link
      href="/tracker"
      className="hidden text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)] sm:inline"
    >
      Tracker
    </Link>
  );
}
