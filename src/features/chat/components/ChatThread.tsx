"use client";

import { ChatLayoutTemplate } from "@/components/templates/ChatLayoutTemplate";
import { MessageList } from "@/components/organisms/MessageList";
import { PromptComposer } from "@/components/organisms/PromptComposer";
import { useChat } from "../hooks/useChat";
import { useModelStore } from "@/store/useModelStore";

export function ChatThread({ chatId }: { chatId: string }) {
  const { messages, streamingMessageId, isStreaming, sendMessage, toggleReaction, regenerateMessage } =
    useChat(chatId);
  const selectedModelId = useModelStore((s) => s.selectedModelId);

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
        <PromptComposer
          disabled={isStreaming}
          onSend={async (content) => {
            await sendMessage(content, selectedModelId, chatId);
          }}
        />
      }
    />
  );
}
