"use client";

import { useCallback, useEffect, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUsageStore } from "@/store/useUsageStore";
import { chatService } from "../services/chatService";
import { useStreamingMessage } from "./useStreamingMessage";
import { DEFAULT_MODEL_ID, getModelName, isModelAvailable, resolveApiModel } from "@/config/models.config";
import { ApiError, getApiErrorMessage } from "@/services/httpClient";

function isNotFoundError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 404;
}

export function isLimitReachedError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 403 && !err.message.toLowerCase().includes("image");
}

export class ModelUnavailableError extends Error {}

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

// Backend conversation ids are Mongo ObjectIds. Guards against stale/bad
// ids (e.g. a browser tab left on /c/undefined) instead of forwarding them
// to the API and erroring out.
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
  const streaming = useStreamingMessage();
  const isAuthReady = useAuthStore((s) => s.hasHydrated && s.isAuthenticated && s.isAuthBootstrapComplete);
  const [chatNotFound, setChatNotFound] = useState(false);

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
    // Don't load messages until auth is ready — firing before hydration
    // sends an unauthenticated request that can wipe the session.
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
    [removeChat]
  );

  const renameChat = useCallback(
    async (id: string, title: string) => {
      await chatService.renameChat(id, title);
      const chat = useChatStore.getState().chats.find((c) => c.id === id);
      if (chat) upsertChat({ ...chat, title });
    },
    [upsertChat]
  );

  const stopStreaming = useCallback(() => {
    streaming.stop();
    setStreamingMessageId(null);
  }, [streaming, setStreamingMessageId]);

  const sendMessage = useCallback(
    async (content: string, modelId: string, rawTargetChatId?: string): Promise<string> => {
      const targetChatId = isValidChatId(rawTargetChatId) ? rawTargetChatId : undefined;
      const assistantMessageId = createId();
      const apiModel = resolveApiModel(modelId);

      if (!targetChatId && !isModelAvailable(modelId)) {
        // Brand-new chat: nothing rendered yet for this conversation, so
        // there's nowhere to show a notice bubble — the caller (which
        // ideally already pre-checked this) needs to handle it instead.
        throw new ModelUnavailableError(`${getModelName(modelId)} isn't available yet — coming soon! Try GPT for now.`);
      }

      // Existing chat: we already have a stable id, so show the user's
      // message and a "thinking" placeholder immediately.
      if (targetChatId) {
        addMessage({ id: createId(), chatId: targetChatId, role: "user", content, createdAt: new Date().toISOString() });

        if (!isModelAvailable(modelId)) {
          // Only OpenAI is actually wired up on the backend — don't spend a
          // network call (or a free prompt) pretending other models work.
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

        addMessage({
          id: assistantMessageId,
          chatId: targetChatId,
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString(),
          modelId,
        });
        setStreamingMessageId(assistantMessageId);
      }

      let result;
      try {
        result = await chatService.sendChatMessage({
          model: apiModel,
          message: content,
          conversationId: targetChatId,
        });
        useAuthStore.getState().setPromptCount(result.usage.promptsUsed);
      } catch (err) {
        setStreamingMessageId(null);
        if (targetChatId) {
          if (isNotFoundError(err)) {
            // This conversation doesn't exist for us anymore (stale URL,
            // deleted, wrong account) — bail out to the parent page rather
            // than leaving the user stuck retrying against a dead chat.
            removeChat(targetChatId);
            setChatNotFound(true);
            return targetChatId;
          }
          if (isImageUpgradeError(err)) {
            updateMessage(targetChatId, assistantMessageId, {
              content: "Image generation requires an Image Generation plan. Please subscribe to unlock it. 🔒",
            });
            useUsageStore.getState().openImageUpgradeModal();
            return targetChatId;
          }
          if (isLimitReachedError(err)) {
            removeMessage(targetChatId, assistantMessageId);
            useUsageStore.getState().openUpgradeModal();
            return targetChatId;
          }
          // Already have a message bubble to show the error in — surface it
          // there and stop, rather than also rejecting (which would crash
          // into an unhandled-error overlay on top of the visible message).
          updateMessage(targetChatId, assistantMessageId, { content: getApiErrorMessage(err) });
          return targetChatId;
        }
        // New chat: nothing rendered yet, so the caller needs to know it failed.
        throw err;
      }

      const activeChatId = result.conversation.id;

      // New chat: we only know the real id now, so add both messages at once.
      if (!targetChatId) {
        upsertChat(result.conversation);
        addMessage({ id: createId(), chatId: activeChatId, role: "user", content, createdAt: new Date().toISOString() });
        addMessage({
          id: assistantMessageId,
          chatId: activeChatId,
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString(),
          modelId,
          imageUrl: result.message.imageUrl,
        });
        setStreamingMessageId(assistantMessageId);
      } else if (result.message.imageUrl) {
        // Existing chat image: set imageUrl on the placeholder immediately
        updateMessage(activeChatId, assistantMessageId, { imageUrl: result.message.imageUrl });
      }

      streaming.start(
        result.message.content,
        (partial) => updateMessage(activeChatId, assistantMessageId, { content: partial }),
        () => {
          setStreamingMessageId(null);
          void loadChats();
        }
      );

      return activeChatId;
    },
    [addMessage, updateMessage, removeMessage, setStreamingMessageId, streaming, upsertChat, loadChats, removeChat]
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
        updateMessage(targetChatId, messageId, {
          content: `${getModelName(modelId)} isn't available yet — coming soon! Try GPT for now.`,
        });
        return;
      }

      updateMessage(targetChatId, messageId, { content: "" });
      setStreamingMessageId(messageId);
      try {
        const result = await chatService.sendChatMessage({
          model: resolveApiModel(modelId),
          message: lastUserMessage.content,
          conversationId: targetChatId,
        });
        useAuthStore.getState().setPromptCount(result.usage.promptsUsed);
        streaming.start(
          result.message.content,
          (partial) => updateMessage(targetChatId, messageId, { content: partial }),
          () => {
            setStreamingMessageId(null);
            void loadChats();
          }
        );
      } catch (err) {
        setStreamingMessageId(null);
        if (isNotFoundError(err)) {
          removeChat(targetChatId);
          setChatNotFound(true);
          return;
        }
        // Don't lose the original reply on failure — restore it rather
        // than leaving the bubble blank or overwritten permanently.
        if (isLimitReachedError(err)) {
          useUsageStore.getState().openUpgradeModal();
          updateMessage(targetChatId, messageId, { content: previousContent });
          return;
        }
        console.error("Failed to regenerate message:", err);
        updateMessage(targetChatId, messageId, { content: previousContent });
      }
    },
    [messagesByChat, updateMessage, setStreamingMessageId, streaming, loadChats, removeChat]
  );

  const toggleReaction = useCallback(
    (targetChatId: string, messageId: string, reaction: "liked" | "disliked") => {
      const message = messagesByChat[targetChatId]?.find((m) => m.id === messageId);
      if (!message) return;
      const opposite = reaction === "liked" ? "disliked" : "liked";
      updateMessage(targetChatId, messageId, {
        [reaction]: !message[reaction],
        [opposite]: false,
      });
    },
    [messagesByChat, updateMessage]
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
    toggleReaction,
    regenerateMessage,
  };
}
