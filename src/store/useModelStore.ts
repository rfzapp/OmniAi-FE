import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_MODEL_ID, DEFAULT_GPT_VARIANT_ID, DEFAULT_CLAUDE_VARIANT_ID } from "@/config/models.config";

interface ModelState {
  selectedModelId: string;
  selectedGptVariantId: string;
  selectedClaudeVariantId: string;
  setSelectedModelId: (id: string) => void;
  setSelectedGptVariantId: (variantId: string) => void;
  setSelectedClaudeVariantId: (variantId: string) => void;
  getEffectiveModelId: () => string;
}

export const useModelStore = create<ModelState>()(
  persist(
    (set, get) => ({
      selectedModelId: DEFAULT_MODEL_ID,
      selectedGptVariantId: DEFAULT_GPT_VARIANT_ID,
      selectedClaudeVariantId: DEFAULT_CLAUDE_VARIANT_ID,
      setSelectedModelId: (id) => set({ selectedModelId: id }),
      setSelectedGptVariantId: (variantId) =>
        set({ selectedModelId: "gpt-omni", selectedGptVariantId: variantId }),
      setSelectedClaudeVariantId: (variantId) =>
        set({ selectedModelId: "claude-omni", selectedClaudeVariantId: variantId }),
      getEffectiveModelId: () => {
        const { selectedModelId, selectedGptVariantId, selectedClaudeVariantId } = get();
        if (selectedModelId === "gpt-omni") return selectedGptVariantId;
        if (selectedModelId === "claude-omni") return selectedClaudeVariantId;
        return selectedModelId;
      },
    }),
    { name: "omniai-model" },
  ),
);
