"use client";

import { useMemo } from "react";
import { useChatStore } from "@/store/useChatStore";
import { groupByDate, type HistoryGroup } from "@/lib/date";
import type { Chat } from "@/features/chat/types";

const GROUP_ORDER: HistoryGroup[] = ["Today", "Yesterday", "Previous 7 Days", "Older"];

export function useChatHistory(query = "") {
  const chats = useChatStore((s) => s.chats);

  return useMemo(() => {
    const filtered = query.trim()
      ? chats.filter((c) => c.title.toLowerCase().includes(query.trim().toLowerCase()))
      : chats;
    const grouped = groupByDate<Chat>(filtered, (chat) => new Date(chat.updatedAt));
    return GROUP_ORDER.map((group) => ({ group, chats: grouped[group] })).filter(
      (section) => section.chats.length > 0
    );
  }, [chats, query]);
}
