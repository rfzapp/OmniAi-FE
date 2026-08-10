"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { ComposerBar } from "./ComposerBar";
import { useRemainingFreePrompts, useIsUnlimitedPlan } from "@/store/useUsageStore";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface ChatEmptyStateProps {
  onSend: (content: string) => void | Promise<void>;
  disabled?: boolean;
  statusMessage?: string;
  statusIsError?: boolean;
}

export function ChatEmptyState({ onSend, disabled, statusMessage, statusIsError }: ChatEmptyStateProps) {
  const remaining = useRemainingFreePrompts();
  const isUnlimited = useIsUnlimitedPlan();
  const limitReached = remaining <= 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4">
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
        {(statusMessage || !isUnlimited) && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
              statusIsError &&
                "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
              !statusIsError &&
                !isUnlimited &&
                remaining === 0 &&
                "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
              !statusIsError &&
                !isUnlimited &&
                remaining === 1 &&
                "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
              !statusIsError &&
                (isUnlimited || remaining >= 2) &&
                "border-border bg-muted text-foreground"
            )}
          >
            <Zap className="size-3.5" />
            {statusMessage ??
              (limitReached
                ? "You've used all your free prompts"
                : `You have ${remaining} free prompt${remaining === 1 ? "" : "s"} remaining`)}
          </span>
        )}

        {/* Not disabling on limitReached: the click needs to reach onSend
            so its own limit check can open the upgrade modal. */}
        <ComposerBar onSend={onSend} disabled={disabled} />
      </motion.div>
    </div>
  );
}
