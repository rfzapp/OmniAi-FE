import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getInitials } from "@/utils/text";
import { useChatStore } from "./useChatStore";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
  subscription: string;
  promptCount: number;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setSession: (user: AuthUser, accessToken: string) => void;
  setUser: (user: AuthUser) => void;
  setAccessToken: (accessToken: string) => void;
  setPromptCount: (promptCount: number) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setSession: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      setUser: (user) => set({ user, isAuthenticated: true }),
      setAccessToken: (accessToken) => set({ accessToken }),
      // Server is the source of truth for usage — this just mirrors the
      // count it returns after each AI call so the UI stays in sync
      // without an extra round-trip.
      setPromptCount: (promptCount) =>
        set((state) => (state.user ? { user: { ...state.user, promptCount } } : state)),
      clearSession: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
        // Runs for every path that ends a session (explicit logout, or a
        // silently-expired refresh token) so no trace of the previous
        // account's chats lingers, and the next login refetches fresh.
        useChatStore.getState().reset();
      },
    }),
    { name: "omniai-auth" },
  ),
);

export function getUserInitials(user: AuthUser | null): string {
  if (!user) return "?";
  return getInitials(user.fullName);
}
