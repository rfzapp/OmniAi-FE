"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Attachment } from "@/features/prompt/types";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUsageStore } from "@/store/useUsageStore";
import { chatService } from "../services/chatService";
import { DEFAULT_MODEL_ID, getModelName, isModelAvailable, resolveApiModel } from "@/config/models.config";
import { ApiError, getApiErrorMessage } from "@/services/httpClient";

function isNotFoundError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 404;
}

export function isLimitReachedError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 403 && !err.message.toLowerCase().includes("image");
}

export class ModelUnavailableError extends Error { }

export function isModelUnavailableError(err: unknown): err is ModelUnavailableError {
  return err instanceof ModelUnavailableError;
}

export function isImageUpgradeError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 403 && err.message.toLowerCase().includes("image");
}

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isValidChatId(id?: string): id is string {
  return !!id && /^[0-9a-fA-F]{24}$/.test(id);
}

export function useChat(chatId?: string) {
  const chats = useChatStore((s) => s.chats);
  const chatsLoaded = useChatStore((s) => s.chatsLoaded);
  const messagesByChat = useChatStore((s) => s.messagesByChat);
  const streamingMessageId = useChatStore((s) => s.streamingMessageId);
  const setChats = useChatStore((s) => s.setChats);
  const upsertChat = useChatStore((s) => s.upsertChat);
  const removeChat = useChatStore((s) => s.removeChat);
  const setMessages = useChatStore((s) => s.setMessages);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const removeMessage = useChatStore((s) => s.removeMessage);
  const setStreamingMessageId = useChatStore((s) => s.setStreamingMessageId);
  const isAuthReady = useAuthStore((s) => s.hasHydrated && s.isAuthenticated && s.isAuthBootstrapComplete);
  const [chatNotFound, setChatNotFound] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const messages = (chatId && messagesByChat[chatId]) || [];

  const loadChats = useCallback(async () => {
    try {
      const list = await chatService.listChats();
      setChats(list);
    } catch (err) {
      console.error("Failed to load chats:", err);
    }
  }, [setChats]);

  useEffect(() => {
    if (!isAuthReady || chatsLoaded) return;
    void loadChats();
  }, [chatsLoaded, loadChats, isAuthReady]);

  useEffect(() => {
    setChatNotFound(false);
    if (!isValidChatId(chatId)) {
      if (chatId) setChatNotFound(true);
      return;
    }
    if (!isAuthReady) return;
    if (messagesByChat[chatId]) return;
    chatService
      .listMessages(chatId)
      .then((list) => setMessages(chatId, list))
      .catch((err) => {
        console.error("Failed to load messages:", err);
        if (isNotFoundError(err)) {
          removeChat(chatId);
          setChatNotFound(true);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, isAuthReady]);

  const deleteChat = useCallback(
    async (id: string) => {
      await chatService.deleteChat(id);
      removeChat(id);
    },
    [removeChat],
  );

  const renameChat = useCallback(
    async (id: string, title: string) => {
      await chatService.renameChat(id, title);
      const chat = useChatStore.getState().chats.find((c) => c.id === id);
      if (chat) upsertChat({ ...chat, title });
    },
    [upsertChat],
  );

  const pinChat = useCallback(
    async (id: string, isPinned: boolean) => {
      const chat = useChatStore.getState().chats.find((c) => c.id === id);
      if (chat) upsertChat({ ...chat, isPinned });
      try {
        await chatService.pinChat(id, isPinned);
      } catch (err) {
        console.error("Failed to pin chat:", err);
        if (chat) upsertChat({ ...chat, isPinned: !isPinned });
      }
    },
    [upsertChat],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreamingMessageId(null);
  }, [setStreamingMessageId]);

  const sendMessage = useCallback(
    async (content: string, modelId: string, rawTargetChatId?: string, attachments?: Attachment[]): Promise<string> => {
      const targetChatId = isValidChatId(rawTargetChatId) ? rawTargetChatId : undefined;
      const assistantMessageId = createId();
      const apiModel = resolveApiModel(modelId);

      if (!targetChatId && !isModelAvailable(modelId)) {
        throw new ModelUnavailableError(`${getModelName(modelId)} isn't available yet — coming soon! Try GPT for now.`);
      }

      if (targetChatId) {
        const optimisticImageUrl = attachments?.[0]?.file ? URL.createObjectURL(attachments[0].file) : undefined;
        addMessage({ id: createId(), chatId: targetChatId, role: "user", content, createdAt: new Date().toISOString(), imageUrl: optimisticImageUrl });

        if (!isModelAvailable(modelId)) {
          addMessage({
            id: assistantMessageId,
            chatId: targetChatId,
            role: "assistant",
            content: `${getModelName(modelId)} isn't available yet — coming soon! Try GPT for now.`,
            createdAt: new Date().toISOString(),
            modelId,
          });
          return targetChatId;
        }

        addMessage({ id: assistantMessageId, chatId: targetChatId, role: "assistant", content: "", createdAt: new Date().toISOString(), modelId });
        setStreamingMessageId(assistantMessageId);
      }

      abortRef.current = new AbortController();
      let activeChatId = targetChatId ?? "";

      try {
        const result = await chatService.sendChatMessageStream(
          { model: apiModel, message: content, conversationId: targetChatId, attachments },
          (token) => {
            const cid = activeChatId || targetChatId!;
            const prev = useChatStore.getState().messagesByChat[cid]?.find((m) => m.id === assistantMessageId)?.content ?? "";
            updateMessage(cid, assistantMessageId, { content: prev + token });
          },
          abortRef.current.signal,
        );

        useAuthStore.getState().setPromptCount(result.usage.promptsUsed, result.usage.promptsUsed24h);
        activeChatId = result.conversation.id;

        if (!targetChatId) {
          upsertChat(result.conversation);
          const optimisticImageUrl = attachments?.[0]?.file ? URL.createObjectURL(attachments[0].file) : undefined;
          addMessage({ id: createId(), chatId: activeChatId, role: "user", content, createdAt: new Date().toISOString(), imageUrl: optimisticImageUrl });
          addMessage({ id: assistantMessageId, chatId: activeChatId, role: "assistant", content: result.message.content, createdAt: new Date().toISOString(), modelId });
        }

        setStreamingMessageId(null);

        if (!targetChatId) {
          void loadChats();
        } else {
          const existing = useChatStore.getState().chats.find((c) => c.id === activeChatId);
          if (existing) upsertChat({ ...existing, updatedAt: new Date().toISOString() });
        }

        return activeChatId;
      } catch (err) {
        setStreamingMessageId(null);
        abortRef.current = null;

        if (targetChatId) {
          if (isNotFoundError(err)) { removeChat(targetChatId); setChatNotFound(true); return targetChatId; }
          if (isImageUpgradeError(err)) {
            updateMessage(targetChatId, assistantMessageId, { content: "Image generation requires an Image Generation plan. Please subscribe to unlock it. 🔒" });
            useUsageStore.getState().openImageUpgradeModal();
            return targetChatId;
          }
          if (isLimitReachedError(err)) {
            removeMessage(targetChatId, assistantMessageId);
            useUsageStore.getState().openUpgradeModal();
            return targetChatId;
          }
          updateMessage(targetChatId, assistantMessageId, { content: getApiErrorMessage(err) });
          return targetChatId;
        }
        throw err;
      }
    },
    [addMessage, updateMessage, removeMessage, setStreamingMessageId, upsertChat, loadChats, removeChat, messagesByChat],
  );

  const regenerateMessage = useCallback(
    async (targetChatId: string, messageId: string) => {
      const list = messagesByChat[targetChatId] ?? [];
      const index = list.findIndex((m) => m.id === messageId);
      const lastUserMessage = [...list.slice(0, index)].reverse().find((m) => m.role === "user");
      if (!lastUserMessage) return;
      const previousContent = list[index]?.content ?? "";
      const modelId = list[index]?.modelId ?? DEFAULT_MODEL_ID;

      if (!isModelAvailable(modelId)) {
        updateMessage(targetChatId, messageId, { content: `${getModelName(modelId)} isn't available yet — coming soon! Try GPT for now.` });
        return;
      }

      updateMessage(targetChatId, messageId, { content: "" });
      setStreamingMessageId(messageId);
      abortRef.current = new AbortController();

      try {
        const result = await chatService.sendChatMessageStream(
          { model: resolveApiModel(modelId), message: lastUserMessage.content, conversationId: targetChatId },
          (token) => {
            const prev = useChatStore.getState().messagesByChat[targetChatId]?.find((m) => m.id === messageId)?.content ?? "";
            updateMessage(targetChatId, messageId, { content: prev + token });
          },
          abortRef.current.signal,
        );

        useAuthStore.getState().setPromptCount(result.usage.promptsUsed, result.usage.promptsUsed24h);
        setStreamingMessageId(null);
        const existing = useChatStore.getState().chats.find((c) => c.id === targetChatId);
        if (existing) upsertChat({ ...existing, updatedAt: new Date().toISOString() });
      } catch (err) {
        setStreamingMessageId(null);
        abortRef.current = null;
        if (isNotFoundError(err)) { removeChat(targetChatId); setChatNotFound(true); return; }
        if (isLimitReachedError(err)) {
          useUsageStore.getState().openUpgradeModal();
          updateMessage(targetChatId, messageId, { content: previousContent });
          return;
        }
        console.error("Failed to regenerate message:", err);
        updateMessage(targetChatId, messageId, { content: previousContent });
      }
    },
    [messagesByChat, updateMessage, setStreamingMessageId, upsertChat, removeChat],
  );

  const toggleReaction = useCallback(
    (targetChatId: string, messageId: string, reaction: "liked" | "disliked") => {
      const message = messagesByChat[targetChatId]?.find((m) => m.id === messageId);
      if (!message) return;
      const opposite = reaction === "liked" ? "disliked" : "liked";
      updateMessage(targetChatId, messageId, { [reaction]: !message[reaction], [opposite]: false });
    },
    [messagesByChat, updateMessage],
  );

  return {
    chats,
    messages,
    isStreaming: Boolean(streamingMessageId),
    streamingMessageId,
    chatNotFound,
    sendMessage,
    stopStreaming,
    deleteChat,
    renameChat,
    pinChat,
    toggleReaction,
    regenerateMessage,
  };
}
