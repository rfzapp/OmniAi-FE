import { create } from "zustand";
import { DEFAULT_MODEL_ID, DEFAULT_GPT_VARIANT_ID } from "@/config/models.config";

interface ModelState {
  selectedModelId: string;
  selectedGptVariantId: string;
  setSelectedModelId: (id: string) => void;
  setSelectedGptVariantId: (variantId: string) => void;
  getEffectiveModelId: () => string;
}

export const useModelStore = create<ModelState>((set, get) => ({
  selectedModelId: DEFAULT_MODEL_ID,
  selectedGptVariantId: DEFAULT_GPT_VARIANT_ID,
  setSelectedModelId: (id) => set({ selectedModelId: id }),
  setSelectedGptVariantId: (variantId) =>
    set({ selectedModelId: "gpt-omni", selectedGptVariantId: variantId }),
  getEffectiveModelId: () => {
    const { selectedModelId, selectedGptVariantId } = get();
    if (selectedModelId === "gpt-omni") {
      return selectedGptVariantId;
    }
    return selectedModelId;
  },
}));
