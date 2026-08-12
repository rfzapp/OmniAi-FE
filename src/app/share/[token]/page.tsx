import { Logo } from "@/components/atoms/Logo";
import { SharedChatView } from "@/features/chat/components/SharedChatView";

interface SharedChatPageProps {
  params: Promise<{ token: string }>;
}

export default async function SharedChatPage({ params }: SharedChatPageProps) {
  const { token } = await params;
  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center border-b border-border px-4 sm:px-6">
        <Logo size={20} />
        <span className="ml-3 text-sm text-muted-foreground">Shared conversation</span>
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <SharedChatView token={token} />
      </main>
    </div>
  );
}
