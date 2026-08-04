import {
  createChatRecord,
  deleteChatRecord,
  fetchChats,
  renameChatRecord,
  touchChatRecord,
} from "@/api/mock/chats.mock";
import {
  appendMessage,
  fetchMessages,
  generateAssistantReply,
} from "@/api/mock/messages.mock";
import type { Chat, Message } from "../types";

export const chatService = {
  listChats: (): Promise<Chat[]> => fetchChats(),
  createChat: (title: string): Promise<Chat> => createChatRecord(title),
  renameChat: (id: string, title: string): Promise<void> => renameChatRecord(id, title),
  deleteChat: (id: string): Promise<void> => deleteChatRecord(id),
  touchChat: (id: string): Promise<void> => touchChatRecord(id),
  listMessages: (chatId: string): Promise<Message[]> => fetchMessages(chatId),
  sendMessage: (message: Message): Promise<Message> => appendMessage(message),
  requestAssistantReply: (prompt: string): Promise<string> =>
    generateAssistantReply(prompt),
};
