"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

const routes = [
  { href: "/dashboard", label: "Clip Generator" },
  { href: "/dashboard/ai-shorts", label: "AI Shorts" },
  { href: "/dashboard/ai-agent", label: "AI Agent" },
  { href: "/dashboard/ugc-gallery", label: "Gallery" },
  { href: "/dashboard/studio", label: "Studio" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function TopNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
      <div className="flex items-center justify-between h-12 px-6 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <span className="w-6 h-6 rounded bg-foreground flex items-center justify-center text-[10px] font-bold text-background">
            V
          </span>
          <span className="font-semibold text-sm tracking-tight">Virlo</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {routes.map((r) => {
            const active = pathname === r.href;
            return (
              <Link
                key={r.href}
                href={r.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150",
                  active
                    ? "bg-foreground text-background"
                    : "text-text-muted hover:text-text hover:bg-bg-alt"
                )}
              >
                {r.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md text-text-muted hover:text-text hover:bg-bg-alt transition-colors duration-150 shrink-0"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex overflow-x-auto border-t border-border px-4 gap-1">
        {routes.map((r) => {
          const active = pathname === r.href;
          return (
            <Link
              key={r.href}
              href={r.href}
              className={cn(
                "shrink-0 px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors duration-150",
                active
                  ? "border-foreground text-text"
                  : "border-transparent text-text-muted"
              )}
            >
              {r.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
