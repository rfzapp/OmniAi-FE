"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatEmptyState } from "@/components/organisms/ChatEmptyState";
import { useChat, isLimitReachedError, isModelUnavailableError } from "../hooks/useChat";
import { useModelStore } from "@/store/useModelStore";
import { useUsageStore, useRemainingFreePrompts } from "@/store/useUsageStore";
import { useAuthStore } from "@/store/useAuthStore";
import { isModelAvailable, getModelName } from "@/config/models.config";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/services/httpClient";

export function NewChatHome() {
  const router = useRouter();
  const { sendMessage } = useChat();
  const selectedModelId = useModelStore((s) => s.selectedModelId);
  const remaining = useRemainingFreePrompts();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openUpgradeModal = useUsageStore((s) => s.openUpgradeModal);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSend(content: string) {
    if (!isAuthenticated) {
      setError("Please log in to start chatting.");
      return;
    }
    if (!isModelAvailable(selectedModelId)) {
      setNotice(`${getModelName(selectedModelId)} isn't available yet — coming soon! Try GPT for now.`);
      return;
    }
    if (remaining <= 0) {
      openUpgradeModal();
      return;
    }
    setError(null);
    setNotice(null);
    setIsSending(true);
    try {
      const chatId = await sendMessage(content, selectedModelId);
      router.push(ROUTES.chat(chatId));
    } catch (err) {
      if (isLimitReachedError(err)) {
        openUpgradeModal();
      } else if (isModelUnavailableError(err)) {
        setNotice(err.message);
      } else {
        setError(getApiErrorMessage(err));
      }
    } finally {
      setIsSending(false);
    }
  }

  return (
    <ChatEmptyState
      onSend={handleSend}
      disabled={isSending}
      statusMessage={isSending ? "Thinking…" : (error ?? notice ?? undefined)}
      statusIsError={Boolean(error) && !isSending}
    />
  );
}
