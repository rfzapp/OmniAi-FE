"use client";

import { useRouter } from "next/navigation";
import { ChatEmptyState } from "@/components/organisms/ChatEmptyState";
import { useChat } from "../hooks/useChat";
import { useModelStore } from "@/store/useModelStore";
import { ROUTES } from "@/constants/routes";

export function NewChatHome() {
  const router = useRouter();
  const { sendMessage } = useChat();
  const selectedModelId = useModelStore((s) => s.selectedModelId);

  async function handleSend(content: string) {
    const chatId = await sendMessage(content, selectedModelId);
    router.push(ROUTES.chat(chatId));
  }

  return <ChatEmptyState onSend={handleSend} />;
}
