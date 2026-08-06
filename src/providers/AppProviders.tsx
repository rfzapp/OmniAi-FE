"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/atoms/Tooltip";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/features/auth/services/authService";
import { usePreferencesSync } from "@/features/settings/hooks/usePreferencesSync";

function AuthBootstrap() {
  const syncPreferences = usePreferencesSync();

  useEffect(() => {
    if (!useAuthStore.getState().isAuthenticated) return;
    void (async () => {
      // Revalidates the persisted session against the backend (and
      // refreshes the access token via httpClient's 401 handling if it
      // has expired), then hydrates theme/default-model/settings from the
      // account's saved preferences so they follow the user across devices.
      await authService.fetchCurrentUser();
      await syncPreferences();
    })().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <AuthBootstrap />
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
