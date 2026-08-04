import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface LogoProps {
  className?: string;
  size?: number;
  withWordmark?: boolean;
}

export function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="omni-logo-gradient" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="var(--brand-400)" />
          <stop offset="100%" stopColor="var(--brand-700)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#omni-logo-gradient)" />
      <circle cx="16" cy="16" r="7" stroke="white" strokeOpacity="0.9" strokeWidth="2" />
      <circle cx="16" cy="16" r="2" fill="white" />
      <circle cx="23.5" cy="10.5" r="1.6" fill="white" />
    </svg>
  );
}

export function Logo({ className, size = 28, withWordmark = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className="text-base font-semibold tracking-tight text-foreground">
          {siteConfig.name}
        </span>
      )}
    </div>
  );
}
