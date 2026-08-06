"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AI_MODELS } from "@/features/models/data/models";
import { DEFAULT_MODEL_ID, getModelName, resolveApiModel } from "@/config/models.config";
import { useModelStore } from "@/store/useModelStore";
import { settingsService } from "../services/settingsService";
import { getApiErrorMessage } from "@/services/httpClient";

export function DefaultModelSelect() {
  const selectedModelId = useModelStore((s) => s.selectedModelId);
  const setSelectedModelId = useModelStore((s) => s.setSelectedModelId);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(modelId: string | null) {
    if (!modelId) return;
    const previous = selectedModelId;
    setSelectedModelId(modelId);
    setError(null);
    try {
      await settingsService.updatePreferences({ defaultModel: resolveApiModel(modelId) });
    } catch (err) {
      setSelectedModelId(previous);
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Select value={selectedModelId || DEFAULT_MODEL_ID} onValueChange={handleChange}>
        <SelectTrigger className="w-full max-w-xs sm:w-56">
          <SelectValue>{(value: string) => getModelName(value)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {AI_MODELS.map((model) => (
            <SelectItem key={model.id} value={model.id} disabled={!model.available}>
              {model.name}
              {!model.available && <span className="text-muted-foreground">(Soon)</span>}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
