"use client";

import { Zap } from "lucide-react";
import { ComposerBar } from "./ComposerBar";
import { useRemainingFreePrompts } from "@/store/useUsageStore";
import { useAuthStore } from "@/store/useAuthStore";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface Attachment {
  id: string;
  name: string;
  size: number;
  type?: string;
  file?: File;
}

interface ChatEmptyStateProps {
  onSend: (content: string, attachments?: Attachment[]) => void | Promise<void>;
  disabled?: boolean;
  statusMessage?: string;
  statusIsError?: boolean;
}

export function ChatEmptyState({ onSend, disabled, statusMessage, statusIsError }: ChatEmptyStateProps) {
  const remaining = useRemainingFreePrompts();
  const subscription = useAuthStore((s) => s.user?.subscription ?? "free");
  const limitReached = remaining <= 0;
  const isFree = subscription === "free";

  let displayMsg = statusMessage;
  if (!displayMsg) {
    if (isFree) {
      displayMsg = limitReached
        ? "You've used all your free prompts"
        : `You have ${remaining} free prompt${remaining === 1 ? "" : "s"} remaining`;
    } else {
      const planName =
        subscription === "ultra_pro" ? "Ultra Pro"
          : subscription === "pro" ? "Pro"
            : "Standard";
      displayMsg = limitReached
        ? `You've used all your prompts for this month (${planName} plan)`
        : `You have ${remaining} prompt${remaining === 1 ? "" : "s"} remaining this month`;
    }
  }

  const badgeClass = cn(
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
    statusIsError
      ? "border-red-200 bg-red-50 text-red-700"
      : limitReached
        ? "border-red-200 bg-red-50 text-red-700"
        : remaining <= (isFree ? 1 : 10)
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-border bg-muted text-foreground"
  );

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center px-4 pb-16">
      <div className="flex w-full max-w-2xl flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-2xl font-semibold text-foreground sm:text-3xl">
            {siteConfig.tagline}
          </p>
          <span className={badgeClass}>
            <Zap className="size-3.5" />
            {displayMsg}
          </span>
        </div>
        <div className="w-full">
          <ComposerBar onSend={onSend} disabled={disabled} />
        </div>
      </div>
    </div>
  );
}
