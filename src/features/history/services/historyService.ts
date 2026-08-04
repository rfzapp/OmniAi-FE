import { fetchChats } from "@/api/mock/chats.mock";
import type { Chat } from "@/features/chat/types";
import { groupByDate, type HistoryGroup } from "@/lib/date";

export async function getGroupedHistory(): Promise<Record<HistoryGroup, Chat[]>> {
  const chats = await fetchChats();
  return groupByDate(chats, (chat) => new Date(chat.updatedAt));
}
