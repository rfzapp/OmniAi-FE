"use client";

import { Switch } from "@/components/atoms/Switch";
import { Button } from "@/components/atoms/Button";
import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { SettingsRow } from "@/features/settings/components/SettingsRow";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function PrivacySettingsPage() {
  const privacy = useSettingsStore((s) => s.privacy);
  const setPrivacy = useSettingsStore((s) => s.setPrivacy);

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-foreground">Privacy</h1>
      <SettingsSection title="Data controls">
        <SettingsRow
          label="Improve the model"
          description="Allow anonymized conversations to help train OmniAI"
        >
          <Switch
            checked={privacy.improveModel}
            onCheckedChange={(v) => setPrivacy("improveModel", v)}
          />
        </SettingsRow>
        <SettingsRow label="Usage analytics" description="Share anonymous usage data">
          <Switch
            checked={privacy.shareUsageAnalytics}
            onCheckedChange={(v) => setPrivacy("shareUsageAnalytics", v)}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Danger zone">
        <SettingsRow label="Delete account" description="Permanently remove your OmniAI account">
          <Button variant="destructive" size="sm" type="button">
            Delete account
          </Button>
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
