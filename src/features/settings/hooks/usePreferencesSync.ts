"use client";

import { useCallback } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { settingsService } from "../services/settingsService";
import { useModelStore } from "@/store/useModelStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { getUiModelIdForApiModel } from "@/config/models.config";

/** Fetches the account's saved preferences and applies them to theme, default
 * model, and settings stores — used right after login/signup, and once on
 * app mount for an already-authenticated session. */
export function usePreferencesSync() {
  const { setTheme } = useTheme();

  return useCallback(async () => {
    const preferences = await settingsService.getPreferences();
    setTheme(preferences.theme);
    useModelStore.getState().setSelectedModelId(getUiModelIdForApiModel(preferences.defaultModel));
    useSettingsStore.getState().hydrate({
      connectedModelIds: preferences.connectedModelIds,
      notifications: preferences.notifications,
      privacy: preferences.privacy,
    });
  }, [setTheme]);
}
