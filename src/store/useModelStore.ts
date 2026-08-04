import { create } from "zustand";
import { DEFAULT_MODEL_ID } from "@/config/models.config";

interface ModelState {
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
}

export const useModelStore = create<ModelState>((set) => ({
  selectedModelId: DEFAULT_MODEL_ID,
  setSelectedModelId: (id) => set({ selectedModelId: id }),
}));
