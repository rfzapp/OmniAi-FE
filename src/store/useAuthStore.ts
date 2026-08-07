import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getInitials } from "@/utils/text";
import { useChatStore } from "./useChatStore";
import { useSettingsStore } from "./useSettingsStore";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
  subscription: string;
  imagePlan: "none" | "basic" | "pro";
  promptCount: number;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  // True once Zustand has rehydrated from localStorage — guards prevent
  // premature redirects firing on the default false isAuthenticated state.
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setSession: (user: AuthUser, accessToken: string, refreshToken?: string) => void;
  setUser: (user: AuthUser) => void;
  setAccessToken: (accessToken: string, refreshToken?: string) => void;
  setPromptCount: (promptCount: number) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setSession: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken: refreshToken ?? null, isAuthenticated: true }),
      setUser: (user) => set({ user, isAuthenticated: true }),
      setAccessToken: (accessToken, refreshToken) =>
        set((state) => ({
          accessToken,
          ...(refreshToken ? { refreshToken } : {}),
        })),
      setPromptCount: (promptCount) =>
        set((state) => (state.user ? { user: { ...state.user, promptCount } } : state)),
      clearSession: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        useChatStore.getState().reset();
        useSettingsStore.getState().reset();
      },
    }),
    {
      name: "omniai-auth",
      onRehydrateStorage: () => (state) => {
        // Called once localStorage rehydration completes — flip the gate.
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function getUserInitials(user: AuthUser | null): string {
  if (!user) return "?";
  return getInitials(user.fullName);
}
