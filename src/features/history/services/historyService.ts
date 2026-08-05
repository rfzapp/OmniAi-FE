import { chatService } from "@/features/chat/services/chatService";
import type { Chat } from "@/features/chat/types";
import { groupByDate, type HistoryGroup } from "@/lib/date";

export async function getGroupedHistory(): Promise<Record<HistoryGroup, Chat[]>> {
  const chats = await chatService.listChats();
  return groupByDate(chats, (chat) => new Date(chat.updatedAt));
}
