"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SETTINGS_NAV } from "@/constants/navigation";

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden w-56 shrink-0 flex-col gap-0.5 md:flex">
        {SETTINGS_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                active && "bg-muted text-foreground"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <nav className="no-scrollbar sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-border bg-background px-1 pb-2 md:hidden">
        {SETTINGS_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors",
                active
                  ? "border-brand-200 bg-brand-100 text-brand-700 dark:border-brand-800 dark:bg-brand-900/40 dark:text-brand-300"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="size-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
