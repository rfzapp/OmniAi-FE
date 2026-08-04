"use client";

import { motion } from "framer-motion";
import type { SuggestedPrompt } from "@/constants/suggestedPrompts";

interface SuggestedPromptCardProps {
  prompt: SuggestedPrompt;
  onSelect: (prompt: string) => void;
  index?: number;
}

export function SuggestedPromptCard({ prompt, onSelect, index = 0 }: SuggestedPromptCardProps) {
  const Icon = prompt.icon;
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(prompt.prompt)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-3.5 text-left shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50/50 dark:hover:bg-brand-950/20"
    >
      <span className="flex size-7 items-center justify-center rounded-md bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
        <Icon className="size-3.5" />
      </span>
      <span className="text-sm font-medium text-foreground">{prompt.title}</span>
      <span className="line-clamp-2 text-xs text-muted-foreground">{prompt.prompt}</span>
    </motion.button>
  );
}
