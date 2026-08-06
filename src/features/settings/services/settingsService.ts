import { httpClient } from "@/services/httpClient";
import { useAuthStore, type AuthUser } from "@/store/useAuthStore";

export interface NotificationPrefs {
  emailUpdates: boolean;
  productAnnouncements: boolean;
  chatMentions: boolean;
}

export interface PrivacyPrefs {
  improveModel: boolean;
  shareUsageAnalytics: boolean;
}

export interface Preferences {
  defaultModel: string;
  theme: "light" | "dark";
  connectedModelIds: string[];
  notifications: NotificationPrefs;
  privacy: PrivacyPrefs;
}

export interface ApiKeyEntry {
  provider: string;
  maskedKey: string;
  createdAt: string;
}

export interface UpdateProfileInput {
  fullName?: string;
  avatar?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePreferencesInput {
  defaultModel?: string;
  theme?: "light" | "dark";
  connectedModelIds?: string[];
  notifications?: Partial<NotificationPrefs>;
  privacy?: Partial<PrivacyPrefs>;
}

export const settingsService = {
  async updateProfile(input: UpdateProfileInput): Promise<AuthUser> {
    const data = await httpClient.put<{ user: AuthUser }>("/user/profile", input);
    useAuthStore.getState().setUser(data.user);
    return data.user;
  },

  async changePassword(input: ChangePasswordInput): Promise<void> {
    await httpClient.put("/user/change-password", input);
  },

  async deleteAccount(): Promise<void> {
    await httpClient.delete("/user/delete");
  },

  async getPreferences(): Promise<Preferences> {
    const data = await httpClient.get<{ preferences: Preferences }>("/settings");
    return data.preferences;
  },

  async updatePreferences(input: UpdatePreferencesInput): Promise<Preferences> {
    const data = await httpClient.put<{ preferences: Preferences }>("/settings", input);
    return data.preferences;
  },

  async listApiKeys(): Promise<ApiKeyEntry[]> {
    const data = await httpClient.get<{ apiKeys: ApiKeyEntry[] }>("/settings/api-keys");
    return data.apiKeys;
  },

  async addApiKey(provider: string, apiKey: string): Promise<ApiKeyEntry> {
    const data = await httpClient.post<{ apiKey: ApiKeyEntry }>("/settings/api-keys", { provider, apiKey });
    return data.apiKey;
  },

  async deleteApiKey(provider: string): Promise<void> {
    await httpClient.delete(`/settings/api-keys/${encodeURIComponent(provider)}`);
  },
};
