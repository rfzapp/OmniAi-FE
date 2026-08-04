import { create } from "zustand";
import { FREE_PROMPT_LIMIT } from "@/config/usage.config";

interface UsageState {
  promptsUsed: number;
  upgradeModalOpen: boolean;
  incrementUsage: () => void;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
}

/**
 * In-memory only (no persistence) — there's no backend/account yet to tie
 * usage to, so a page refresh intentionally resets the free-prompt count.
 * Once auth + a real API exist, swap this for a server-tracked value.
 */
export const useUsageStore = create<UsageState>((set) => ({
  promptsUsed: 0,
  upgradeModalOpen: false,
  incrementUsage: () => set((s) => ({ promptsUsed: s.promptsUsed + 1 })),
  openUpgradeModal: () => set({ upgradeModalOpen: true }),
  closeUpgradeModal: () => set({ upgradeModalOpen: false }),
}));

export function useRemainingFreePrompts(): number {
  const promptsUsed = useUsageStore((s) => s.promptsUsed);
  return Math.max(0, FREE_PROMPT_LIMIT - promptsUsed);
}
