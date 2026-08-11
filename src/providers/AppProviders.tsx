"use client";

import { useEffect, type ReactNode } from "react";
import { TooltipProvider } from "@/components/atoms/Tooltip";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/features/auth/services/authService";
import { httpClient } from "@/services/httpClient";
import { usePreferencesSync } from "@/features/settings/hooks/usePreferencesSync";

function AuthBootstrap() {
  const syncPreferences = usePreferencesSync();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    const { isAuthenticated, refreshToken } = useAuthStore.getState();
    if (!isAuthenticated) {
      useAuthStore.getState().setAuthBootstrapComplete(true);
      return;
    }

    void (async () => {
      try {
        const body = refreshToken ? { refreshToken } : undefined;
        const data = await httpClient
          .post<{ accessToken: string; refreshToken: string }>(
            "/auth/refresh",
            body,
            { skipAuthRefresh: true },
          )
          .catch(() => null);

        if (!data) {
          return;
        }

        useAuthStore.getState().setAccessToken(data.accessToken, data.refreshToken);

        await authService.fetchCurrentUser();
        await syncPreferences();
      } catch {
        // Silent fail — user will be redirected by guards if needed.
      } finally {
        useAuthStore.getState().setAuthBootstrapComplete(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <AuthBootstrap />
      {children}
    </TooltipProvider>
  );
}
