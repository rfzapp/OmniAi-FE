"use client";

import { Switch } from "@/components/atoms/Switch";
import { SettingsRow } from "./SettingsRow";
import { AI_MODELS } from "@/features/models/data/models";
import { useSettingsStore } from "@/store/useSettingsStore";

export function ModelConnectionsList() {
  const connectedModelIds = useSettingsStore((s) => s.connectedModelIds);
  const toggleConnectedModel = useSettingsStore((s) => s.toggleConnectedModel);

  return (
    <>
      {AI_MODELS.map((model) => (
        <SettingsRow key={model.id} label={model.name} description={`${model.provider} — ${model.description}`}>
          <Switch
            checked={connectedModelIds.includes(model.id)}
            onCheckedChange={() => toggleConnectedModel(model.id)}
          />
        </SettingsRow>
      ))}
    </>
  );
}
