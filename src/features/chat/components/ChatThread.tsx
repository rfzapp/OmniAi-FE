"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatLayoutTemplate } from "@/components/templates/ChatLayoutTemplate";
import { MessageList } from "@/components/organisms/MessageList";
import { ComposerBar } from "@/components/organisms/ComposerBar";
import { useChat } from "../hooks/useChat";
import { useModelStore } from "@/store/useModelStore";
import { useUsageStore, useRemainingFreePrompts } from "@/store/useUsageStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/constants/routes";

export function ChatThread({ chatId }: { chatId: string }) {
  const router = useRouter();
  const { messages, streamingMessageId, isStreaming, chatNotFound, sendMessage, stopStreaming, toggleReaction, regenerateMessage } =
    useChat(chatId);
  const getEffectiveModelId = useModelStore((s) => s.getEffectiveModelId);
  const remaining = useRemainingFreePrompts();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const openUpgradeModal = useUsageStore((s) => s.openUpgradeModal);
  const limitReached = remaining <= 0;

  useEffect(() => {
    if (chatNotFound) router.replace(ROUTES.home);
  }, [chatNotFound, router]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.chat(chatId))}`);
  }, [hasHydrated, isAuthenticated, router, chatId]);

  // Don't render anything until Zustand rehydrates — prevents a flash
  // of redirect to login on every page reload for authenticated users.
  if (!hasHydrated) return (
    <div className="flex h-full items-center justify-center">
      <div className="size-5 animate-spin rounded-full border-2 border-border border-t-brand-600" />
    </div>
  );

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
          disabled={isStreaming}
          isStreaming={isStreaming}
          onStop={stopStreaming}
          onSend={async (content) => {
            if (!isAuthenticated) return;
            // Not pre-disabling on limitReached: a disabled composer can't
            // be clicked at all, so this check (and the modal it opens)
            // would never run. Let the send through and gate it here instead.
            if (limitReached) {
              openUpgradeModal();
              return;
            }
            await sendMessage(content, getEffectiveModelId(), chatId);
          }}
        />
      }
    />
  );
}
