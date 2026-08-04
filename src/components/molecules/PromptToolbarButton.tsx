"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}

export function PromptToolbarButton({
  icon: Icon,
  label,
  active = false,
  onClick,
  ...rest
}: PromptToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-full border border-transparent px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted",
        active &&
          "border-brand-200 bg-brand-100 text-brand-700 hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-900/40 dark:text-brand-300"
      )}
      {...rest}
    >
      <Icon className="size-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
