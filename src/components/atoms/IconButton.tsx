"use client";

import type { ComponentProps } from "react";
import { Button } from "./Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ComponentProps<typeof Button> {
  label: string;
  showTooltip?: boolean;
  active?: boolean;
}

export function IconButton({
  label,
  showTooltip = true,
  active = false,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: IconButtonProps) {
  const button = (
    <Button
      variant={variant}
      size={size}
      aria-label={label}
      data-active={active || undefined}
      className={cn(
        "text-muted-foreground data-[active]:bg-brand-100 data-[active]:text-brand-700 dark:data-[active]:bg-brand-900/40 dark:data-[active]:text-brand-300",
        className
      )}
      {...props}
    />
  );

  if (!showTooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
