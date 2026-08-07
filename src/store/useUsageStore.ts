import { create } from "zustand";
import { useAuthStore } from "@/store/useAuthStore";
import { FREE_PROMPT_LIMIT } from "@/config/usage.config";

interface UsageState {
  upgradeModalOpen: boolean;
  imageUpgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
  openImageUpgradeModal: () => void;
  closeImageUpgradeModal: () => void;
}

export const useUsageStore = create<UsageState>((set) => ({
  upgradeModalOpen: false,
  imageUpgradeModalOpen: false,
  openUpgradeModal: () => set({ upgradeModalOpen: true }),
  closeUpgradeModal: () => set({ upgradeModalOpen: false }),
  openImageUpgradeModal: () => set({ imageUpgradeModalOpen: true }),
  closeImageUpgradeModal: () => set({ imageUpgradeModalOpen: false }),
}));

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

export function useHasImagePlan(): boolean {
  const user = useAuthStore((s) => s.user);
  return !!user && user.imagePlan !== "none";
}
