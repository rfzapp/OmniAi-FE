"use client";

import { useCallback, useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";
import { chatService } from "../services/chatService";
import type { Message } from "../types";
import { useStreamingMessage } from "./useStreamingMessage";

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
  const setStreamingMessageId = useChatStore((s) => s.setStreamingMessageId);
  const streaming = useStreamingMessage();

  const messages = (chatId && messagesByChat[chatId]) || [];

  const loadChats = useCallback(async () => {
    const list = await chatService.listChats();
    setChats(list);
  }, [setChats]);

  useEffect(() => {
    if (!chatsLoaded) void loadChats();
  }, [chatsLoaded, loadChats]);

  useEffect(() => {
    if (!chatId || messagesByChat[chatId]) return;
    void chatService.listMessages(chatId).then((list) => setMessages(chatId, list));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

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

  const sendMessage = useCallback(
    async (content: string, modelId: string, targetChatId?: string): Promise<string> => {
      let activeChatId = targetChatId;

      if (!activeChatId) {
        const title = content.length > 48 ? `${content.slice(0, 48)}…` : content;
        const chat = await chatService.createChat(title);
        upsertChat(chat);
        activeChatId = chat.id;
      }

      const userMessage: Message = {
        id: createId(),
        chatId: activeChatId,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };
      addMessage(userMessage);
      void chatService.sendMessage(userMessage);

      const assistantMessageId = createId();
      const assistantMessage: Message = {
        id: assistantMessageId,
        chatId: activeChatId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        modelId,
      };
      addMessage(assistantMessage);
      setStreamingMessageId(assistantMessageId);

      const fullReply = await chatService.requestAssistantReply(content);
      streaming.start(
        fullReply,
        (partial) => updateMessage(activeChatId!, assistantMessageId, { content: partial }),
        () => {
          setStreamingMessageId(null);
          void chatService.touchChat(activeChatId!).then(loadChats);
          const finalMessage: Message = { ...assistantMessage, content: fullReply };
          void chatService.sendMessage(finalMessage);
        }
      );

      return activeChatId;
    },
    [addMessage, updateMessage, setStreamingMessageId, streaming, upsertChat, loadChats]
  );

  const regenerateMessage = useCallback(
    async (targetChatId: string, messageId: string) => {
      const list = messagesByChat[targetChatId] ?? [];
      const index = list.findIndex((m) => m.id === messageId);
      const lastUserMessage = [...list.slice(0, index)].reverse().find((m) => m.role === "user");
      if (!lastUserMessage) return;

      updateMessage(targetChatId, messageId, { content: "" });
      setStreamingMessageId(messageId);
      const fullReply = await chatService.requestAssistantReply(lastUserMessage.content);
      streaming.start(
        fullReply,
        (partial) => updateMessage(targetChatId, messageId, { content: partial }),
        () => {
          setStreamingMessageId(null);
          void chatService.touchChat(targetChatId).then(loadChats);
        }
      );
    },
    [messagesByChat, updateMessage, setStreamingMessageId, streaming, loadChats]
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
    sendMessage,
    deleteChat,
    renameChat,
    toggleReaction,
    regenerateMessage,
  };
}
