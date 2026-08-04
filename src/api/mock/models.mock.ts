import { AI_MODELS } from "@/features/models/data/models";
import type { AiModel } from "@/features/models/types";
import { delay } from "./delay";

export async function fetchModels(): Promise<AiModel[]> {
  return delay(AI_MODELS, 150);
}
