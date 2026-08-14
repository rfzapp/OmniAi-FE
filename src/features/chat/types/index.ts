import type { ID } from "@/types";

export type MessageRole = "user" | "assistant";

export interface Message {
  id: ID;
  chatId: ID;
  role: MessageRole;
  content: string;
  createdAt: string;
  modelId?: string;
  imageUrl?: string;
  liked?: boolean;
  disliked?: boolean;
}

export interface Chat {
  id: ID;
  title: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatWithMessages extends Chat {
  messages: Message[];
}
