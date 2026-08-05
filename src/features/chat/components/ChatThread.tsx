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
  const { messages, streamingMessageId, isStreaming, chatNotFound, sendMessage, toggleReaction, regenerateMessage } =
    useChat(chatId);
  const selectedModelId = useModelStore((s) => s.selectedModelId);
  const remaining = useRemainingFreePrompts();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openUpgradeModal = useUsageStore((s) => s.openUpgradeModal);
  const limitReached = remaining <= 0;

  useEffect(() => {
    // Stale/foreign URL (deleted chat, wrong account, bad id) — bounce back
    // to a fresh chat instead of leaving the user stuck on a dead thread.
    if (chatNotFound) router.replace(ROUTES.home);
  }, [chatNotFound, router]);

  useEffect(() => {
    // Reached an existing chat's URL directly while logged out (or the
    // session expired mid-visit) — send to login instead of letting a send
    // attempt surface a raw backend error.
    if (!isAuthenticated) router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.chat(chatId))}`);
  }, [isAuthenticated, router, chatId]);

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
          onSend={async (content) => {
            if (!isAuthenticated) return;
            // Not pre-disabling on limitReached: a disabled composer can't
            // be clicked at all, so this check (and the modal it opens)
            // would never run. Let the send through and gate it here instead.
            if (limitReached) {
              openUpgradeModal();
              return;
            }
            await sendMessage(content, selectedModelId, chatId);
          }}
        />
      }
    />
  );
}
