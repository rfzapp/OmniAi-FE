"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/constants/routes";

export function SubscriptionAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    // Wait for Zustand to rehydrate before redirecting — on first render
    // isAuthenticated is always false even for logged-in users.
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.settingsSubscription)}`);
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Show nothing until we know the real auth state.
  if (!hasHydrated) return null;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
