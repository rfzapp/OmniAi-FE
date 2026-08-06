"use client";

import { useState } from "react";
import { Switch } from "@/components/atoms/Switch";
import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { SettingsRow } from "@/features/settings/components/SettingsRow";
import { useSettingsStore } from "@/store/useSettingsStore";
import { settingsService } from "@/features/settings/services/settingsService";
import { getApiErrorMessage } from "@/services/httpClient";

export default function NotificationsSettingsPage() {
  const notifications = useSettingsStore((s) => s.notifications);
  const setNotification = useSettingsStore((s) => s.setNotification);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(key: keyof typeof notifications, value: boolean) {
    setError(null);
    const previous = notifications[key];
    setNotification(key, value);
    try {
      await settingsService.updatePreferences({ notifications: { [key]: value } });
    } catch (err) {
      setNotification(key, previous);
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-foreground">Notifications</h1>
      {error && (
        <p role="alert" className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <SettingsSection title="Email">
        <SettingsRow label="Product updates" description="New features and improvements">
          <Switch
            checked={notifications.emailUpdates}
            onCheckedChange={(v) => handleChange("emailUpdates", v)}
          />
        </SettingsRow>
        <SettingsRow label="Announcements" description="Occasional news from the OmniAI team">
          <Switch
            checked={notifications.productAnnouncements}
            onCheckedChange={(v) => handleChange("productAnnouncements", v)}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="In-app">
        <SettingsRow label="Mentions" description="When someone shares a chat with you">
          <Switch
            checked={notifications.chatMentions}
            onCheckedChange={(v) => handleChange("chatMentions", v)}
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
