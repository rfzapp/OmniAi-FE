"use client";

import { motion } from "framer-motion";
import { LogoMark } from "@/components/atoms/Logo";
import { MessageMarkdown } from "@/features/chat/components/MessageMarkdown";
import { MessageActionsBar } from "@/components/molecules/MessageActionsBar";
import { ThinkingAnimation } from "@/components/ui/ThinkingAnimation";
import { getModelName } from "@/config/models.config";
import type { Message } from "@/features/chat/types";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  onToggleLike?: () => void;
  onToggleDislike?: () => void;
  onShare?: () => void;
}

function resolveThinkingModel(modelId?: string): "Luna" | "Sol" | "Terra" | "Claude" {
  if (!modelId) return "Luna";
  if (modelId === "gpt-5.6-sol" || modelId === "gpt-omni") return "Sol";
  if (modelId === "gpt-5.6-terra") return "Terra";
  if (modelId === "gpt-5.6-luna") return "Luna";
  if (modelId === "claude-omni" || modelId.startsWith("claude-")) return "Claude";
  return "Luna";
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
        className="group/message flex justify-end px-4 py-2"
      >
        <div className="flex max-w-[85%] flex-col items-end md:max-w-[70%]">
          <div className="flex w-full flex-col gap-2 rounded-[24px] bg-[#F4F4F4] hover:bg-[#ECECEC] px-5 py-3 text-sm text-[#0D0D0D] transition-colors md:text-[15px]">
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="Attached image"
                className="max-h-64 max-w-full rounded-xl object-scale-down shadow-sm"
              />
            )}
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          <div className="mt-1 opacity-0 transition-opacity group-hover/message:opacity-100 pr-2">
            <MessageActionsBar message={message} />
          </div>
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
          <div className="w-[560px] max-w-[min(560px,90vw)] min-w-[280px] rounded-2xl border border-border bg-white p-4 shadow-sm">
            <ThinkingAnimation
              model={resolveThinkingModel(message.modelId)}
              modelLabel={message.modelId ? getModelName(message.modelId) : undefined}
            />
          </div>
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
        {!isStreaming && (
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
