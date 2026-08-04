"use client";

import { motion } from "framer-motion";
import { LogoMark } from "@/components/atoms/Logo";
import { PromptComposer } from "./PromptComposer";
import { SuggestedPromptCard } from "@/components/molecules/SuggestedPromptCard";
import { SUGGESTED_PROMPTS } from "@/constants/suggestedPrompts";
import { siteConfig } from "@/config/site";

interface ChatEmptyStateProps {
  onSend: (content: string) => void | Promise<void>;
}

export function ChatEmptyState({ onSend }: ChatEmptyStateProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <LogoMark size={44} />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {siteConfig.name}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">{siteConfig.tagline}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="w-full"
      >
        <PromptComposer onSend={onSend} />
      </motion.div>

      <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <SuggestedPromptCard
            key={prompt.id}
            prompt={prompt}
            index={index}
            onSelect={(text) => void onSend(text)}
          />
        ))}
      </div>
    </div>
  );
}
