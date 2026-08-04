"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/constants/routes";

/**
 * Covers direct navigation (URL bar, bookmark) to the subscription page —
 * the in-app CTAs already redirect through useGoToSubscription, but this
 * guards the route itself for anyone who lands here without a session.
 */
export function SubscriptionAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.settingsSubscription)}`);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
