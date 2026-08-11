"use client";

import { motion } from "framer-motion";
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
        ? `You've used all your prompts for today (${planName} plan)`
        : `You have ${remaining} prompt${remaining === 1 ? "" : "s"} remaining for today`;
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
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 -mt-16">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center text-lg font-medium text-muted-foreground sm:text-xl"
      >
        {siteConfig.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex w-full flex-col items-center gap-3"
      >
        <span className={badgeClass}>
          <Zap className="size-3.5" />
          {displayMsg}
        </span>

        <ComposerBar onSend={onSend} disabled={disabled} />
      </motion.div>
    </div>
  );
}
