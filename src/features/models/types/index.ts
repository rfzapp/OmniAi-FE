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
}
