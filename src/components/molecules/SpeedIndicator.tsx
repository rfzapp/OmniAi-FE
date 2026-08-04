import { cn } from "@/lib/utils";
import type { SpeedTier } from "@/types";

const SPEED_CONFIG: Record<SpeedTier, { label: string; bars: number }> = {
  fast: { label: "Fast", bars: 3 },
  standard: { label: "Standard", bars: 2 },
  slower: { label: "Thorough", bars: 1 },
};

export function SpeedIndicator({ speed }: { speed: SpeedTier }) {
  const { label, bars } = SPEED_CONFIG[speed];
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <div className="flex items-end gap-0.5">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={cn(
              "w-1 rounded-full bg-muted-foreground/30",
              bar === 1 && "h-1.5",
              bar === 2 && "h-2.5",
              bar === 3 && "h-3.5",
              bar <= bars && "bg-brand-500"
            )}
          />
        ))}
      </div>
      <span>{label}</span>
    </div>
  );
}
