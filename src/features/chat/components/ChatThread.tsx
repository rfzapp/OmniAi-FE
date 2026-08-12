"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatLayoutTemplate } from "@/components/templates/ChatLayoutTemplate";
import { MessageList } from "@/components/organisms/MessageList";
import { ComposerBar } from "@/components/organisms/ComposerBar";
import { ShareChatDialog } from "@/components/organisms/ShareChatDialog";
import { useChat } from "../hooks/useChat";
import { useModelStore } from "@/store/useModelStore";
import { useUsageStore, useRemainingFreePrompts } from "@/store/useUsageStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
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
  const chatTitle = useChatStore((s) => s.chats.find((c) => c.id === chatId)?.title ?? "Chat");
  const limitReached = remaining <= 0;
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (chatNotFound) router.replace(ROUTES.home);
  }, [chatNotFound, router]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.chat(chatId))}`);
  }, [hasHydrated, isAuthenticated, router, chatId]);

  if (!hasHydrated) return (
    <div className="flex h-full items-center justify-center">
      <div className="size-5 animate-spin rounded-full border-2 border-border border-t-[#0d0d0d]" />
    </div>
  );

  return (
    <>
      <ChatLayoutTemplate
        messages={
          <MessageList
            messages={messages}
            streamingMessageId={streamingMessageId}
            onRegenerate={(messageId) => void regenerateMessage(chatId, messageId)}
            onToggleLike={(messageId) => toggleReaction(chatId, messageId, "liked")}
            onToggleDislike={(messageId) => toggleReaction(chatId, messageId, "disliked")}
            onShare={() => setShareOpen(true)}
          />
        }
        composer={
          <ComposerBar
            disabled={isStreaming}
            isStreaming={isStreaming}
            onStop={stopStreaming}
            onSend={async (content, attachments) => {
              if (!isAuthenticated) return;
              if (limitReached) {
                openUpgradeModal();
                return;
              }
              await sendMessage(content, getEffectiveModelId(), chatId, attachments);
            }}
          />
        }
      />
      <ShareChatDialog
        chatId={chatId}
        chatTitle={chatTitle}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
}
