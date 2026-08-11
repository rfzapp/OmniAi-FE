"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatEmptyState } from "@/components/organisms/ChatEmptyState";
import { ChatLayoutTemplate } from "@/components/templates/ChatLayoutTemplate";
import { ComposerBar } from "@/components/organisms/ComposerBar";
import { ThinkingAnimation } from "@/components/ui/ThinkingAnimation";
import { useChat, isLimitReachedError, isModelUnavailableError } from "../hooks/useChat";
import { useModelStore } from "@/store/useModelStore";
import { useUsageStore, useRemainingFreePrompts } from "@/store/useUsageStore";
import { useAuthStore } from "@/store/useAuthStore";
import { isModelAvailable, getModelName } from "@/config/models.config";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/services/httpClient";
import type { Attachment } from "@/features/prompt/types";

export function NewChatHome() {
  const router = useRouter();
  const { sendMessage } = useChat();
  const getEffectiveModelId = useModelStore((s) => s.getEffectiveModelId);
  const remaining = useRemainingFreePrompts();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openUpgradeModal = useUsageStore((s) => s.openUpgradeModal);
  const [isSending, setIsSending] = useState(false);
  const [activeModelId, setActiveModelId] = useState<string | undefined>(undefined);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function resolveThinkingModel(modelId?: string): "Luna" | "Sol" | "Terra" {
    if (modelId === "gpt-5.6-sol") return "Sol";
    if (modelId === "gpt-5.6-terra") return "Terra";
    return "Luna";
  }

  async function handleSend(content: string, attachments?: Attachment[]) {
    const activeModelIdForRequest = getEffectiveModelId();
    if (!isAuthenticated) {
      setError("Please log in to start chatting.");
      return;
    }
    if (!isModelAvailable(activeModelIdForRequest)) {
      setNotice(`${getModelName(activeModelIdForRequest)} isn't available yet — coming soon! Try GPT for now.`);
      return;
    }
    if (remaining <= 0) {
      openUpgradeModal();
      return;
    }

    setError(null);
    setNotice(null);
    setActiveModelId(activeModelIdForRequest);
    setPendingPrompt(content);
    setIsSending(true);

    try {
      const chatId = await sendMessage(content, activeModelIdForRequest, undefined, attachments);
      router.push(ROUTES.chat(chatId));
      // Don't reset isSending on success — we're navigating away and
      // resetting would flash the empty state before the new route loads.
    } catch (err) {
      setIsSending(false);
      if (isLimitReachedError(err)) {
        openUpgradeModal();
      } else if (isModelUnavailableError(err)) {
        setNotice(err.message);
      } else {
        setError(getApiErrorMessage(err));
      }
    }
  }

  if (isSending) {
    return (
      <ChatLayoutTemplate
        messages={
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl space-y-3">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-[24px] bg-[#F4F4F4] px-5 py-3 text-sm text-[#0D0D0D] shadow-sm md:text-[15px]">
                  <p className="whitespace-pre-wrap wrap-break-word">{pendingPrompt}</p>
                </div>
              </div>

              <div className="w-full rounded-2xl border border-border bg-white p-4 shadow-sm">
                <ThinkingAnimation model={resolveThinkingModel(activeModelId)} />
              </div>
            </div>
          </div>
        }
        composer={
          <ComposerBar
            onSend={handleSend}
            disabled={true}
            isStreaming={true}
            onStop={() => {
              setIsSending(false);
            }}
          />
        }
      />
    );
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
