import { httpClient } from "@/services/httpClient";
import { useAuthStore, type AuthUser } from "@/store/useAuthStore";

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
}

export const authService = {
  async register(fullName: string, email: string, password: string): Promise<AuthUser> {
    const data = await httpClient.post<AuthResponse>(
      "/auth/register",
      { fullName, email, password },
      { skipAuthRefresh: true },
    );
    // Store refreshToken as fallback for when the httpOnly cookie is
    // unavailable (cross-origin deployments, incognito, Safari ITP, etc.)
    useAuthStore.getState().setSession(data.user, data.accessToken, data.refreshToken);
    return data.user;
  },

  async login(email: string, password: string): Promise<AuthUser> {
    const data = await httpClient.post<AuthResponse>(
      "/auth/login",
      { email, password },
      { skipAuthRefresh: true },
    );
    useAuthStore.getState().setSession(data.user, data.accessToken, data.refreshToken);
    return data.user;
  },

  async logout(): Promise<void> {
    try {
      await httpClient.post("/auth/logout", undefined, { skipAuthRefresh: true });
    } finally {
      useAuthStore.getState().clearSession();
    }
  },

  async fetchCurrentUser(): Promise<AuthUser> {
    const data = await httpClient.get<{ user: AuthUser }>("/auth/me");
    useAuthStore.getState().setUser(data.user);
    return data.user;
  },
};
