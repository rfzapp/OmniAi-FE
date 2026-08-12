"use client";

import { useAutoScroll } from "@/features/chat/hooks/useAutoScroll";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "@/features/chat/types";

interface MessageListProps {
  messages: Message[];
  streamingMessageId: string | null;
  onRegenerate?: (messageId: string) => void;
  onToggleLike?: (messageId: string) => void;
  onToggleDislike?: (messageId: string) => void;
  onShare?: () => void;
}

export function MessageList({
  messages,
  streamingMessageId,
  onRegenerate,
  onToggleLike,
  onToggleDislike,
  onShare,
}: MessageListProps) {
  const bottomRef = useAutoScroll([messages.length, streamingMessageId, messages[messages.length - 1]?.content]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col py-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isStreaming={message.id === streamingMessageId}
          onRegenerate={
            message.role === "assistant" ? () => onRegenerate?.(message.id) : undefined
          }
          onToggleLike={
            message.role === "assistant" ? () => onToggleLike?.(message.id) : undefined
          }
          onToggleDislike={
            message.role === "assistant" ? () => onToggleDislike?.(message.id) : undefined
          }
          onShare={message.role === "assistant" ? onShare : undefined}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
