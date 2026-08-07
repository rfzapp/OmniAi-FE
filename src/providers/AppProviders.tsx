"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/atoms/Tooltip";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/features/auth/services/authService";
import { httpClient } from "@/services/httpClient";
import { usePreferencesSync } from "@/features/settings/hooks/usePreferencesSync";

function AuthBootstrap() {
  const syncPreferences = usePreferencesSync();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    // Wait for Zustand to rehydrate from localStorage before doing anything.
    // Without this gate, isAuthenticated is always false on the first render
    // and the refresh attempt bails out immediately.
    if (!hasHydrated) return;

    const { isAuthenticated, refreshToken } = useAuthStore.getState();
    if (!isAuthenticated) return;

    void (async () => {
      try {
        // Try cookie-based refresh first, fall back to stored refreshToken
        // in case the httpOnly cookie is missing (cross-origin, incognito, etc.)
        const body = refreshToken ? { refreshToken } : undefined;
        const data = await httpClient
          .post<{ accessToken: string; refreshToken: string }>(
            "/auth/refresh",
            body,
            { skipAuthRefresh: true },
          )
          .catch(() => null);

        if (!data) {
          // Refresh failed — could be a network blip, expired cookie, or
          // cross-origin issue. Don't wipe the session aggressively — the
          // existing accessToken may still be valid for a few more minutes,
          // and the 401 auto-refresh in httpClient will handle expiry on
          // the next real API call.
          return;
        }

        useAuthStore.getState().setAccessToken(data.accessToken, data.refreshToken);

        await authService.fetchCurrentUser();
        await syncPreferences();
      } catch {
        // Silent fail — user will be redirected by guards if needed.
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

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
