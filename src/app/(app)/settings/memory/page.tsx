"use client";

import { Switch } from "@/components/atoms/Switch";
import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { SettingsRow } from "@/features/settings/components/SettingsRow";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function MemorySettingsPage() {
  const memoryEnabled = useSettingsStore((s) => s.memoryEnabled);
  const setMemoryEnabled = useSettingsStore((s) => s.setMemoryEnabled);

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-foreground">Memory</h1>
      <SettingsSection
        title="Reference saved memory"
        description="Let OmniAI remember details across conversations"
      >
        <SettingsRow label="Memory" description="OmniAI can save and use context from past chats">
          <Switch checked={memoryEnabled} onCheckedChange={setMemoryEnabled} />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="What OmniAI remembers">
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
          Nothing remembered yet — this feature is still in development.
        </p>
      </SettingsSection>
    </div>
  );
}
