import { ChatThread } from "@/features/chat/components/ChatThread";

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;
  return <ChatThread chatId={chatId} />;
}
