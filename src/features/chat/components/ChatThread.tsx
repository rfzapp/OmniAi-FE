"use client";

import { ChatLayoutTemplate } from "@/components/templates/ChatLayoutTemplate";
import { MessageList } from "@/components/organisms/MessageList";
import { ComposerBar } from "@/components/organisms/ComposerBar";
import { useChat } from "../hooks/useChat";
import { useModelStore } from "@/store/useModelStore";
import { useUsageStore, useRemainingFreePrompts } from "@/store/useUsageStore";

export function ChatThread({ chatId }: { chatId: string }) {
  const { messages, streamingMessageId, isStreaming, sendMessage, toggleReaction, regenerateMessage } =
    useChat(chatId);
  const selectedModelId = useModelStore((s) => s.selectedModelId);
  const remaining = useRemainingFreePrompts();
  const incrementUsage = useUsageStore((s) => s.incrementUsage);
  const openUpgradeModal = useUsageStore((s) => s.openUpgradeModal);
  const limitReached = remaining <= 0;

  return (
    <ChatLayoutTemplate
      messages={
        <MessageList
          messages={messages}
          streamingMessageId={streamingMessageId}
          onRegenerate={(messageId) => void regenerateMessage(chatId, messageId)}
          onToggleLike={(messageId) => toggleReaction(chatId, messageId, "liked")}
          onToggleDislike={(messageId) => toggleReaction(chatId, messageId, "disliked")}
        />
      }
      composer={
        <ComposerBar
          disabled={isStreaming || limitReached}
          onSend={async (content) => {
            if (limitReached) {
              openUpgradeModal();
              return;
            }
            const wasLastFreePrompt = remaining === 1;
            incrementUsage();
            await sendMessage(content, selectedModelId, chatId);
            if (wasLastFreePrompt) openUpgradeModal();
          }}
        />
      }
    />
  );
}
