import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Class Schedule | Atlanta Area",
  description: "View upcoming classes and reserve your spot. Strength, kickboxing, somatic movement.",
};

export default async function SchedulePage() {
  let classes: { id: string; name: string; type: string; instructor: string; start_time: string; duration_minutes: number; capacity: number; price_cents: number }[] | null = null;

  // #region agent log
  console.log("[schedule-debug] entry", { hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL, hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 25) });
  fetch('http://127.0.0.1:7242/ingest/7f2feb5a-28b8-4c93-a204-e6a662cc8d3f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'schedule/page.tsx:entry',message:'SchedulePage entry',data:{hasUrl:!!process.env.NEXT_PUBLIC_SUPABASE_URL,hasKey:!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  try {
    const supabase = createServerClient();

    // #region agent log
    console.log("[schedule-debug] client created ok");
    fetch('http://127.0.0.1:7242/ingest/7f2feb5a-28b8-4c93-a204-e6a662cc8d3f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'schedule/page.tsx:afterClient',message:'Client created',data:{},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    const { data, error } = await supabase
      .from("classes")
      .select("id, name, type, instructor, start_time, duration_minutes, capacity, price_cents")
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true });

    // #region agent log
    console.log("[schedule-debug] query result", { hasData: !!data, len: data?.length ?? 0, hasError: !!error, errMsg: error?.message, errCode: error?.code });
    fetch('http://127.0.0.1:7242/ingest/7f2feb5a-28b8-4c93-a204-e6a662cc8d3f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'schedule/page.tsx:afterQuery',message:'Query result',data:{hasData:!!data,len:data?.length??0,hasError:!!error,errMsg:error?.message,errCode:error?.code},timestamp:Date.now(),hypothesisId:'A,C'})}).catch(()=>{});
    // #endregion

    if (error) {
      console.error("[schedule-debug] Supabase query error:", error);
    } else {
      classes = data;
    }
  } catch (e) {
    // #region agent log
    console.error("[schedule-debug] EXCEPTION:", e instanceof Error ? e.message : String(e));
    fetch('http://127.0.0.1:7242/ingest/7f2feb5a-28b8-4c93-a204-e6a662cc8d3f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'schedule/page.tsx:catch',message:'Exception',data:{err:e instanceof Error ? e.message : String(e)},timestamp:Date.now(),hypothesisId:'B,D'})}).catch(()=>{});
    // #endregion
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← Home
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Class schedule
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Reserve your spot. Payment is collected at the start of class.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        {!classes?.length ? (
          <div className="rounded-xl border border-stone-200/60 bg-white/80 p-8 text-center">
            <p className="text-[var(--muted)]">
              No upcoming classes right now. Check back soon or join the list to get notified.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => {
              const start = new Date(c.start_time);
              const dateStr = start.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
              const timeStr = start.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });
              const priceDollars = (c.price_cents / 100).toFixed(0);
              return (
                <li
                  key={c.id}
                  className="flex flex-col rounded-xl border border-stone-200/60 bg-white/80 p-6 backdrop-blur-sm"
                >
                  <p className="text-sm font-medium text-[var(--accent)]">{c.type}</p>
                  <h2 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                    {c.name}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{c.instructor}</p>
                  <p className="mt-2 text-sm text-[var(--foreground)]">
                    {dateStr} · {timeStr}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                    ${priceDollars} · {c.duration_minutes} min
                  </p>
                  <Link
                    href={`/schedule/${c.id}/signup`}
                    className="mt-4 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#c45c26" }}
                  >
                    Reserve spot
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
