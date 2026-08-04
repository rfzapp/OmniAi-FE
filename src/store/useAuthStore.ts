import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getInitials } from "@/utils/text";

export interface AuthUser {
  name: string;
  email: string;
  avatarInitials: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

/**
 * Mock auth — no backend yet, so "login" just accepts any email/password
 * and marks the session authenticated. Persisted (unlike usage/dismiss
 * state) because staying logged in across a refresh is what users expect.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, name) => {
        const displayName = name?.trim() || email.split("@")[0] || "Member";
        set({
          isAuthenticated: true,
          user: { name: displayName, email, avatarInitials: getInitials(displayName) },
        });
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: "omniai-auth" }
  )
);
