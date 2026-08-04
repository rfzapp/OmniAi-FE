import { create } from "zustand";
import type { Chat, Message } from "@/features/chat/types";

interface ChatState {
  chats: Chat[];
  chatsLoaded: boolean;
  messagesByChat: Record<string, Message[]>;
  activeChatId: string | null;
  streamingMessageId: string | null;

  setChats: (chats: Chat[]) => void;
  upsertChat: (chat: Chat) => void;
  removeChat: (chatId: string) => void;
  setActiveChatId: (chatId: string | null) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (chatId: string, messageId: string, patch: Partial<Message>) => void;
  removeMessage: (chatId: string, messageId: string) => void;
  setStreamingMessageId: (id: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  chatsLoaded: false,
  messagesByChat: {},
  activeChatId: null,
  streamingMessageId: null,

  setChats: (chats) => set({ chats, chatsLoaded: true }),

  upsertChat: (chat) =>
    set((state) => {
      const exists = state.chats.some((c) => c.id === chat.id);
      const chats = exists
        ? state.chats.map((c) => (c.id === chat.id ? chat : c))
        : [chat, ...state.chats];
      return { chats: chats.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) };
    }),

  removeChat: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== chatId),
      activeChatId: state.activeChatId === chatId ? null : state.activeChatId,
    })),

  setActiveChatId: (chatId) => set({ activeChatId: chatId }),

  setMessages: (chatId, messages) =>
    set((state) => ({
      messagesByChat: { ...state.messagesByChat, [chatId]: messages },
    })),

  addMessage: (message) =>
    set((state) => {
      const existing = state.messagesByChat[message.chatId] ?? [];
      return {
        messagesByChat: {
          ...state.messagesByChat,
          [message.chatId]: [...existing, message],
        },
      };
    }),

  updateMessage: (chatId, messageId, patch) =>
    set((state) => {
      const existing = state.messagesByChat[chatId] ?? [];
      return {
        messagesByChat: {
          ...state.messagesByChat,
          [chatId]: existing.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
        },
      };
    }),

  removeMessage: (chatId, messageId) =>
    set((state) => {
      const existing = state.messagesByChat[chatId] ?? [];
      return {
        messagesByChat: {
          ...state.messagesByChat,
          [chatId]: existing.filter((m) => m.id !== messageId),
        },
      };
    }),

  setStreamingMessageId: (id) => set({ streamingMessageId: id }),
}));
