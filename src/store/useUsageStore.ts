import { create } from "zustand";
import { useAuthStore } from "@/store/useAuthStore";
import { FREE_PROMPT_LIMIT } from "@/config/usage.config";

interface UsageState {
  upgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
}

export const useUsageStore = create<UsageState>((set) => ({
  upgradeModalOpen: false,
  openUpgradeModal: () => set({ upgradeModalOpen: true }),
  closeUpgradeModal: () => set({ upgradeModalOpen: false }),
}));

/**
 * The backend enforces the prompt limit and is the source of truth; this
 * only mirrors the authenticated user's real count for display. Before
 * login resolves, assume the full free allowance so the composer isn't
 * blocked prematurely — the backend will reject anyway if that's wrong.
 */
export function useRemainingFreePrompts(): number {
  const user = useAuthStore((s) => s.user);
  if (!user) return FREE_PROMPT_LIMIT;
  if (user.subscription !== "free") return Number.POSITIVE_INFINITY;
  return Math.max(0, FREE_PROMPT_LIMIT - user.promptCount);
}

export function useIsUnlimitedPlan(): boolean {
  const user = useAuthStore((s) => s.user);
  return !!user && user.subscription !== "free";
}
