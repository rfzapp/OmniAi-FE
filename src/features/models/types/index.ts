import type { StaticImageData } from "next/image";
import type { SpeedTier } from "@/types";

export interface AiModel {
  id: string;
  provider: string;
  name: string;
  description: string;
  speed: SpeedTier;
  logo: StaticImageData;
  color: string;
  /** Whether the backend actually has a provider wired up for this model yet. */
  available: boolean;
}
