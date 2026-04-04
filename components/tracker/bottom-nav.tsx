"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, Dumbbell, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/tracker/auth-context";
import { isAdminEmail } from "@/lib/tracker/types";

const baseNavItems = [
  { href: "/tracker", label: "Dashboard", icon: Home },
  { href: "/tracker/meals", label: "Meals", icon: UtensilsCrossed },
  { href: "/tracker/exercise", label: "Exercise", icon: Dumbbell },
  { href: "/tracker/settings", label: "Settings", icon: Settings },
];

const adminNavItem = {
  href: "/tracker/admin",
  label: "Students",
  icon: Users,
};

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = isAdminEmail(user?.email);
  const navItems = isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/tracker" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
