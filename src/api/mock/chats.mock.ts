import type { Chat } from "@/features/chat/types";
import { delay } from "./delay";

function daysAgo(days: number, hours = 9): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
}

const chats: Chat[] = [
  {
    id: "chat-1",
    title: "Debugging a React hydration error",
    createdAt: daysAgo(0, 8),
    updatedAt: daysAgo(0, 8),
  },
  {
    id: "chat-2",
    title: "Ideas for a weekend trip",
    createdAt: daysAgo(0, 11),
    updatedAt: daysAgo(0, 11),
  },
  {
    id: "chat-3",
    title: "Explaining transformer attention",
    createdAt: daysAgo(1, 14),
    updatedAt: daysAgo(1, 14),
  },
  {
    id: "chat-4",
    title: "SQL query optimization tips",
    createdAt: daysAgo(3, 10),
    updatedAt: daysAgo(3, 10),
  },
  {
    id: "chat-5",
    title: "Naming a new side project",
    createdAt: daysAgo(5, 16),
    updatedAt: daysAgo(5, 16),
  },
  {
    id: "chat-6",
    title: "Resume bullet point rewrite",
    createdAt: daysAgo(21, 9),
    updatedAt: daysAgo(21, 9),
  },
];

export async function fetchChats(): Promise<Chat[]> {
  return delay(
    [...chats].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    250
  );
}

export async function createChatRecord(title: string): Promise<Chat> {
  const chat: Chat = {
    id: `chat-${Date.now()}`,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  chats.unshift(chat);
  return delay(chat, 150);
}

export async function renameChatRecord(id: string, title: string): Promise<void> {
  const chat = chats.find((c) => c.id === id);
  if (chat) chat.title = title;
  return delay(undefined, 150);
}

export async function deleteChatRecord(id: string): Promise<void> {
  const index = chats.findIndex((c) => c.id === id);
  if (index !== -1) chats.splice(index, 1);
  return delay(undefined, 150);
}

export async function touchChatRecord(id: string): Promise<void> {
  const chat = chats.find((c) => c.id === id);
  if (chat) chat.updatedAt = new Date().toISOString();
  return delay(undefined, 0);
}
