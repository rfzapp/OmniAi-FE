import { fetchModels } from "@/api/mock/models.mock";
import type { AiModel } from "../types";

export const modelsService = {
  listModels: (): Promise<AiModel[]> => fetchModels(),
};
