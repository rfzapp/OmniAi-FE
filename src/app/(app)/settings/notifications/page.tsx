"use client";

import { Switch } from "@/components/atoms/Switch";
import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { SettingsRow } from "@/features/settings/components/SettingsRow";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function NotificationsSettingsPage() {
  const notifications = useSettingsStore((s) => s.notifications);
  const setNotification = useSettingsStore((s) => s.setNotification);

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-foreground">Notifications</h1>
      <SettingsSection title="Email">
        <SettingsRow label="Product updates" description="New features and improvements">
          <Switch
            checked={notifications.emailUpdates}
            onCheckedChange={(v) => setNotification("emailUpdates", v)}
          />
        </SettingsRow>
        <SettingsRow label="Announcements" description="Occasional news from the OmniAI team">
          <Switch
            checked={notifications.productAnnouncements}
            onCheckedChange={(v) => setNotification("productAnnouncements", v)}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="In-app">
        <SettingsRow label="Mentions" description="When someone shares a chat with you">
          <Switch
            checked={notifications.chatMentions}
            onCheckedChange={(v) => setNotification("chatMentions", v)}
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
