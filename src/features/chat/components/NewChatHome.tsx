"use client";

import { useRouter } from "next/navigation";
import { ChatEmptyState } from "@/components/organisms/ChatEmptyState";
import { useChat } from "../hooks/useChat";
import { useModelStore } from "@/store/useModelStore";
import { useUsageStore, useRemainingFreePrompts } from "@/store/useUsageStore";
import { ROUTES } from "@/constants/routes";

export function NewChatHome() {
  const router = useRouter();
  const { sendMessage } = useChat();
  const selectedModelId = useModelStore((s) => s.selectedModelId);
  const remaining = useRemainingFreePrompts();
  const incrementUsage = useUsageStore((s) => s.incrementUsage);
  const openUpgradeModal = useUsageStore((s) => s.openUpgradeModal);

  async function handleSend(content: string) {
    if (remaining <= 0) {
      openUpgradeModal();
      return;
    }
    const wasLastFreePrompt = remaining === 1;
    incrementUsage();
    const chatId = await sendMessage(content, selectedModelId);
    router.push(ROUTES.chat(chatId));
    if (wasLastFreePrompt) openUpgradeModal();
  }

  return <ChatEmptyState onSend={handleSend} />;
}
