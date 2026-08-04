export type ID = string;

export interface ApiResponse<T> {
  data: T;
  success: boolean;
}

export type SpeedTier = "fast" | "standard" | "slower";
