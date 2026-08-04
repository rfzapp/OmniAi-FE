import type { SpeedTier } from "@/types";

export interface AiModel {
  id: string;
  provider: string;
  name: string;
  description: string;
  speed: SpeedTier;
  glyph: string;
}
