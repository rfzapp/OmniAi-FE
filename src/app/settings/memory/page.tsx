"use client";

import { Switch } from "@/components/atoms/Switch";
import { Button } from "@/components/atoms/Button";
import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { SettingsRow } from "@/features/settings/components/SettingsRow";
import { useSettingsStore } from "@/store/useSettingsStore";

const REMEMBERED_ITEMS = [
  "Prefers concise, direct answers",
  "Works primarily in TypeScript and React",
  "Timezone: PKT (UTC+5)",
];

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
        {REMEMBERED_ITEMS.map((item) => (
          <div key={item} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm text-foreground">{item}</span>
            <Button variant="ghost" size="sm" type="button" className="text-muted-foreground">
              Forget
            </Button>
          </div>
        ))}
      </SettingsSection>
    </div>
  );
}
