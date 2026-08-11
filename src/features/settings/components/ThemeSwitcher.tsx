"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { settingsService } from "../services/settingsService";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

function noopSubscribe() {
  return () => { };
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  function handleSelect(value: (typeof OPTIONS)[number]["value"]) {
    setTheme(value);
    // Backend only models light/dark (no "system"), and only bother
    // persisting for signed-in users — best-effort, theme switching
    // shouldn't be blocked or reverted by a failed network call.
    if (useAuthStore.getState().isAuthenticated && (value === "light" || value === "dark")) {
      settingsService.updatePreferences({ theme: value }).catch(() => { });
    }
  }

  return (
    <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
      {OPTIONS.map((option) => {
        const active = mounted && theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors",
              active && "bg-card text-foreground shadow-sm"
            )}
          >
            <option.icon className="size-3.5" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
