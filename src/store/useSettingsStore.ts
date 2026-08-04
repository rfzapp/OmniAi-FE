import { create } from "zustand";

interface NotificationPrefs {
  emailUpdates: boolean;
  productAnnouncements: boolean;
  chatMentions: boolean;
}

interface PrivacyPrefs {
  improveModel: boolean;
  shareUsageAnalytics: boolean;
}

interface SettingsState {
  memoryEnabled: boolean;
  connectedModelIds: string[];
  notifications: NotificationPrefs;
  privacy: PrivacyPrefs;
  setMemoryEnabled: (value: boolean) => void;
  toggleConnectedModel: (id: string) => void;
  setNotification: (key: keyof NotificationPrefs, value: boolean) => void;
  setPrivacy: (key: keyof PrivacyPrefs, value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  memoryEnabled: true,
  connectedModelIds: [
    "gpt-omni",
    "claude-omni",
    "gemini-omni",
    "deepseek-omni",
    "llama-omni",
  ],
  notifications: {
    emailUpdates: true,
    productAnnouncements: false,
    chatMentions: true,
  },
  privacy: {
    improveModel: false,
    shareUsageAnalytics: true,
  },
  setMemoryEnabled: (value) => set({ memoryEnabled: value }),
  toggleConnectedModel: (id) =>
    set((state) => ({
      connectedModelIds: state.connectedModelIds.includes(id)
        ? state.connectedModelIds.filter((m) => m !== id)
        : [...state.connectedModelIds, id],
    })),
  setNotification: (key, value) =>
    set((state) => ({ notifications: { ...state.notifications, [key]: value } })),
  setPrivacy: (key, value) =>
    set((state) => ({ privacy: { ...state.privacy, [key]: value } })),
}));
