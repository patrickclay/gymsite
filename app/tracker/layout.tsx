import type { Metadata } from "next";
import { AuthProvider } from "@/lib/tracker/auth-context";

export const metadata: Metadata = {
  title: "Fitness Tracker",
  description: "Track your meals, calories, macros, and exercise",
};

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {/*
        Hide the main site header/footer for the tracker app.
        The tracker has its own mobile-first shell with bottom nav.
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body > main > header,
            body > main + footer,
            body > header,
            body footer.border-t {
              display: none !important;
            }
          `,
        }}
      />
      <div className="tracker-app min-h-screen bg-background">
        {children}
      </div>
    </AuthProvider>
  );
}
