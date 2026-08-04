"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { ComposerBar } from "./ComposerBar";
import { useRemainingFreePrompts } from "@/store/useUsageStore";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface ChatEmptyStateProps {
  onSend: (content: string) => void | Promise<void>;
}

export function ChatEmptyState({ onSend }: ChatEmptyStateProps) {
  const remaining = useRemainingFreePrompts();
  const limitReached = remaining <= 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 pb-[24vh]">
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
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
            remaining === 0 &&
              "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
            remaining === 1 &&
              "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
            remaining >= 2 && "border-brand-200 bg-brand-50 text-brand-700"
          )}
        >
          <Zap className="size-3.5" />
          {limitReached
            ? "You've used all your free prompts"
            : `You have ${remaining} free prompt${remaining === 1 ? "" : "s"} remaining`}
        </span>

        <ComposerBar onSend={onSend} disabled={limitReached} />
      </motion.div>
    </div>
  );
}
