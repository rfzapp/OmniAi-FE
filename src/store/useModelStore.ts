import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_MODEL_ID,
  DEFAULT_GPT_VARIANT_ID,
  DEFAULT_CLAUDE_VARIANT_ID,
  DEFAULT_DEEPSEEK_VARIANT_ID,
  DEFAULT_GROK_VARIANT_ID,
  DEFAULT_QWEN_VARIANT_ID,
  DEFAULT_MISTRAL_VARIANT_ID,
  DEFAULT_KIMI_VARIANT_ID,
} from "@/config/models.config";

interface ModelState {
  selectedModelId: string;
  selectedGptVariantId: string;
  selectedClaudeVariantId: string;
  selectedDeepSeekVariantId: string;
  selectedGrokVariantId: string;
  selectedQwenVariantId: string;
  selectedMistralVariantId: string;
  selectedKimiVariantId: string;
  setSelectedModelId: (id: string) => void;
  setSelectedGptVariantId: (id: string) => void;
  setSelectedClaudeVariantId: (id: string) => void;
  setSelectedDeepSeekVariantId: (id: string) => void;
  setSelectedGrokVariantId: (id: string) => void;
  setSelectedQwenVariantId: (id: string) => void;
  setSelectedMistralVariantId: (id: string) => void;
  setSelectedKimiVariantId: (id: string) => void;
  getEffectiveModelId: () => string;
}

export const useModelStore = create<ModelState>()(
  persist(
    (set, get) => ({
      selectedModelId: DEFAULT_MODEL_ID,
      selectedGptVariantId: DEFAULT_GPT_VARIANT_ID,
      selectedClaudeVariantId: DEFAULT_CLAUDE_VARIANT_ID,
      selectedDeepSeekVariantId: DEFAULT_DEEPSEEK_VARIANT_ID,
      selectedGrokVariantId: DEFAULT_GROK_VARIANT_ID,
      selectedQwenVariantId: DEFAULT_QWEN_VARIANT_ID,
      selectedMistralVariantId: DEFAULT_MISTRAL_VARIANT_ID,
      selectedKimiVariantId: DEFAULT_KIMI_VARIANT_ID,
      setSelectedModelId: (id) => set({ selectedModelId: id }),
      setSelectedGptVariantId: (id) => set({ selectedModelId: "gpt-omni", selectedGptVariantId: id }),
      setSelectedClaudeVariantId: (id) => set({ selectedModelId: "claude-omni", selectedClaudeVariantId: id }),
      setSelectedDeepSeekVariantId: (id) => set({ selectedModelId: "deepseek-omni", selectedDeepSeekVariantId: id }),
      setSelectedGrokVariantId: (id) => set({ selectedModelId: "grok-omni", selectedGrokVariantId: id }),
      setSelectedQwenVariantId: (id) => set({ selectedModelId: "qwen-omni", selectedQwenVariantId: id }),
      setSelectedMistralVariantId: (id) => set({ selectedModelId: "mistral-omni", selectedMistralVariantId: id }),
      setSelectedKimiVariantId: (id) => set({ selectedModelId: "kimi-omni", selectedKimiVariantId: id }),
      getEffectiveModelId: () => {
        const s = get();
        if (s.selectedModelId === "gpt-omni") return s.selectedGptVariantId;
        if (s.selectedModelId === "claude-omni") return s.selectedClaudeVariantId;
        if (s.selectedModelId === "deepseek-omni") return s.selectedDeepSeekVariantId;
        if (s.selectedModelId === "grok-omni") return s.selectedGrokVariantId;
        if (s.selectedModelId === "qwen-omni") return s.selectedQwenVariantId;
        if (s.selectedModelId === "mistral-omni") return s.selectedMistralVariantId;
        if (s.selectedModelId === "kimi-omni") return s.selectedKimiVariantId;
        return s.selectedModelId;
      },
    }),
    { name: "omniai-model" },
  ),
);
