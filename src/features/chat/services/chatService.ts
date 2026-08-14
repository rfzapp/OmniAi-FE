import { httpClient } from "@/services/httpClient";
import type { Chat, Message, MessageRole } from "../types";

interface BackendConversation {
  id: string;
  title: string;
  model?: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BackendMessage {
  id: string;
  conversationId?: string;
  role: MessageRole;
  content: string;
  model?: string;
  imageUrl?: string | null;
  createdAt: string;
}

function toChat(conversation: BackendConversation): Chat {
  return {
    id: conversation.id,
    title: conversation.title,
    isPinned: conversation.isPinned,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
}

function toMessage(message: BackendMessage, chatId: string): Message {
  return {
    id: message.id,
    chatId,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
    modelId: message.model,
    imageUrl: message.imageUrl ?? undefined,
  };
}

export interface SendChatMessageParams {
  model: string;
  message: string;
  conversationId?: string;
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type?: string;
  file?: File;
}

export interface ChatUsage {
  promptsUsed: number;
  promptsUsed24h?: number;
  promptsLimit: number | null;
}

export interface SendChatMessageResult {
  conversation: Chat;
  message: Message;
  usage: ChatUsage;
}

export const chatService = {
  listChats: async (): Promise<Chat[]> => {
    const data = await httpClient.get<{ conversations: BackendConversation[] }>("/conversations");
    return data.conversations.map(toChat);
  },

  listMessages: async (chatId: string): Promise<Message[]> => {
    const data = await httpClient.get<{ messages: BackendMessage[] }>(`/conversations/${chatId}/messages`);
    return data.messages.map((m) => toMessage(m, chatId));
  },

  sendChatMessage: async (params: SendChatMessageParams): Promise<SendChatMessageResult> => {
    const hasAttachments = Boolean(params.attachments?.length);

    if (hasAttachments) {
      const formData = new FormData();
      formData.append("model", params.model);
      formData.append("message", params.message);
      if (params.conversationId) formData.append("conversationId", params.conversationId);

      params.attachments?.forEach((attachment) => {
        if (attachment.file) {
          formData.append("attachments", attachment.file, attachment.name);
        }
      });

      const data = await httpClient.postFormData<{ conversation: BackendConversation; message: BackendMessage; usage: ChatUsage }>(
        "/ai/chat",
        formData,
      );
      const conversation = toChat(data.conversation);
      return { conversation, message: toMessage(data.message, conversation.id), usage: data.usage };
    }

    const data = await httpClient.post<{ conversation: BackendConversation; message: BackendMessage; usage: ChatUsage }>(
      "/ai/chat",
      params,
    );
    const conversation = toChat(data.conversation);
    return { conversation, message: toMessage(data.message, conversation.id), usage: data.usage };
  },

  deleteChat: async (id: string): Promise<void> => {
    await httpClient.delete(`/conversations/${id}`);
  },

  shareChat: async (id: string): Promise<string> => {
    const data = await httpClient.post<{ shareToken: string }>(`/conversations/${id}/share`);
    return data.shareToken;
  },

  unshareChat: async (id: string): Promise<void> => {
    await httpClient.delete(`/conversations/${id}/share`);
  },

  getSharedChat: async (token: string): Promise<{ conversation: { id: string; title: string }; messages: BackendMessage[] }> => {
    return httpClient.get(`/conversations/shared/${token}`);
  },

  // Renaming isn't backed by the API yet — local-only for now.
  renameChat: async (_id: string, _title: string): Promise<void> => { },

  pinChat: async (id: string, isPinned: boolean): Promise<void> => {
    await httpClient.patch(`/conversations/${id}/pin`, { isPinned });
  },
};
