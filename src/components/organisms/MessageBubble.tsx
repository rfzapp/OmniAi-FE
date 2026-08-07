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
        <div className="max-w-[85%] rounded-[24px] bg-[#F4F4F4] hover:bg-[#ECECEC] px-5 py-3 text-sm text-[#0D0D0D] transition-colors md:max-w-[70%] md:text-[15px]">
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
      className="group/message flex gap-3 px-4 py-3"
    >
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-1 ring-1 ring-border mt-0.5">
        <LogoMark size={16} />
      </div>
      <div className="min-w-0 flex-1 text-[#0D0D0D] md:text-[15px]">
        {showTyping ? (
          <TypingIndicator />
        ) : message.imageUrl ? (
          <div className="flex flex-col gap-3">
            <img
              src={message.imageUrl}
              alt="Generated image"
              className="max-w-sm rounded-xl border border-border shadow-sm"
            />
          </div>
        ) : (
          <MessageMarkdown content={message.content} />
        )}
        {!showTyping && (
          <div className="mt-2 opacity-0 transition-opacity group-hover/message:opacity-100 md:opacity-100">
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
