"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/constants/routes";

/**
 * Subscribing requires an account. Guests get redirected to login first,
 * with a redirect param that sends them straight to Subscription afterward.
 */
export function useGoToSubscription() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return function goToSubscription() {
    if (isAuthenticated) {
      router.push(ROUTES.settingsSubscription);
    } else {
      router.push(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.settingsSubscription)}`);
    }
  };
}
