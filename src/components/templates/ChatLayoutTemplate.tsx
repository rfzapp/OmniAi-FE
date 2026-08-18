import type { ReactNode } from "react";

interface ChatLayoutTemplateProps {
  messages: ReactNode;
  composer: ReactNode;
}

export function ChatLayoutTemplate({ messages, composer }: ChatLayoutTemplateProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{messages}</div>
      <div className="shrink-0 border-t border-border/60 bg-background/95 px-3 pt-2 pb-3 backdrop-blur-sm sm:px-4">
        <div className="mx-auto w-full max-w-3xl">{composer}</div>
      </div>
    </div>
  );
}
