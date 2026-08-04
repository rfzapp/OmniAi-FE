"use client";

import { Check, Copy } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  showTooltip?: boolean;
}

export function CopyButton({ text, label = "Copy", className, showTooltip }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <IconButton
      label={copied ? "Copied" : label}
      className={className}
      showTooltip={showTooltip}
      onClick={() => void copy(text)}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </IconButton>
  );
}
