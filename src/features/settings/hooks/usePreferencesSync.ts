"use client";

import { useCallback } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { settingsService } from "../services/settingsService";
import { useModelStore } from "@/store/useModelStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { DEFAULT_MODEL_ID, getUiModelIdForApiModel } from "@/config/models.config";

/** Fetches the account's saved preferences and applies them to theme, default
 * model, and settings stores — used right after login/signup, and once on
 * app mount for an already-authenticated session. */
export function usePreferencesSync() {
  const { setTheme } = useTheme();

  return useCallback(async () => {
    const preferences = await settingsService.getPreferences();
    setTheme(preferences.theme);

    // Only apply the server's default model if the local selection is still
    // the app default — don't override an explicit user choice stored locally.
    const currentModelId = useModelStore.getState().selectedModelId;
    if (currentModelId === DEFAULT_MODEL_ID) {
      useModelStore.getState().setSelectedModelId(getUiModelIdForApiModel(preferences.defaultModel));
    }

    useSettingsStore.getState().hydrate({
      connectedModelIds: preferences.connectedModelIds,
      notifications: preferences.notifications,
      privacy: preferences.privacy,
    });
  }, [setTheme]);
}
