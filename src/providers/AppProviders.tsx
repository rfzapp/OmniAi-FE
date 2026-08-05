"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/atoms/Tooltip";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/features/auth/services/authService";

function AuthBootstrap() {
  useEffect(() => {
    if (!useAuthStore.getState().isAuthenticated) return;
    // Revalidates the persisted session against the backend (and refreshes
    // the access token via httpClient's 401 handling if it has expired).
    void authService.fetchCurrentUser().catch(() => {});
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
