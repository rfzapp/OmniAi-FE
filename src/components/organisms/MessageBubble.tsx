"use client";

import { motion } from "framer-motion";
import { LogoMark } from "@/components/atoms/Logo";
import { MessageMarkdown } from "@/features/chat/components/MessageMarkdown";
import { MessageActionsBar } from "@/components/molecules/MessageActionsBar";
import { TypingIndicator } from "./TypingIndicator";
import type { Message } from "@/features/chat/types";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  onToggleLike?: () => void;
  onToggleDislike?: () => void;
  onShare?: () => void;
}

export function MessageBubble({
  message,
  isStreaming,
  onRegenerate,
  onToggleLike,
  onToggleDislike,
  onShare,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end px-4 py-2"
      >
        <div className="max-w-[85%] rounded-2xl bg-brand-600 px-4 py-2.5 text-sm text-white md:max-w-[70%] md:text-[15px]">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </motion.div>
    );
  }

  const showTyping = isStreaming && message.content.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group/message flex gap-3 px-4 py-2"
    >
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-1 ring-1 ring-border">
        <LogoMark size={16} />
      </div>
      <div className="min-w-0 flex-1">
        {showTyping ? (
          <TypingIndicator />
        ) : (
          <MessageMarkdown content={message.content} />
        )}
        {!showTyping && (
          <div className="mt-1 opacity-0 transition-opacity group-hover/message:opacity-100 md:opacity-100">
            <MessageActionsBar
              message={message}
              onRegenerate={onRegenerate}
              onToggleLike={onToggleLike}
              onToggleDislike={onToggleDislike}
              onShare={onShare}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
