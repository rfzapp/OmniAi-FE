"use client";

import { useState } from "react";
import { Switch } from "@/components/atoms/Switch";
import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { SettingsRow } from "@/features/settings/components/SettingsRow";
import { DeleteAccountDialog } from "@/features/settings/components/DeleteAccountDialog";
import { useSettingsStore } from "@/store/useSettingsStore";
import { settingsService } from "@/features/settings/services/settingsService";
import { getApiErrorMessage } from "@/services/httpClient";

export default function PrivacySettingsPage() {
  const privacy = useSettingsStore((s) => s.privacy);
  const setPrivacy = useSettingsStore((s) => s.setPrivacy);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(key: keyof typeof privacy, value: boolean) {
    setError(null);
    const previous = privacy[key];
    setPrivacy(key, value);
    try {
      await settingsService.updatePreferences({ privacy: { [key]: value } });
    } catch (err) {
      setPrivacy(key, previous);
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-foreground">Privacy</h1>
      {error && (
        <p role="alert" className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <SettingsSection title="Data controls">
        <SettingsRow
          label="Improve the model"
          description="Allow anonymized conversations to help train OmniAI"
        >
          <Switch
            checked={privacy.improveModel}
            onCheckedChange={(v) => handleChange("improveModel", v)}
          />
        </SettingsRow>
        <SettingsRow label="Usage analytics" description="Share anonymous usage data">
          <Switch
            checked={privacy.shareUsageAnalytics}
            onCheckedChange={(v) => handleChange("shareUsageAnalytics", v)}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Danger zone">
        <SettingsRow label="Delete account" description="Permanently remove your OmniAI account">
          <DeleteAccountDialog />
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
