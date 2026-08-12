"use client";

import { useEffect, useState } from "react";
import { MessageMarkdown } from "./MessageMarkdown";
import { LogoMark } from "@/components/atoms/Logo";
import { chatService } from "../services/chatService";
import { formatTimestamp } from "@/lib/date";

interface SharedMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  imageUrl?: string | null;
  createdAt: string;
}

interface SharedChatViewProps {
  token: string;
}

export function SharedChatView({ token }: SharedChatViewProps) {
  const [title, setTitle] = useState<string>("");
  const [messages, setMessages] = useState<SharedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    chatService
      .getSharedChat(token)
      .then((data: any) => {
        setTitle(data.conversation.title);
        setMessages(data.messages ?? []);
      })
      .catch(() => setError("This shared conversation could not be found or has been removed."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-5 animate-spin rounded-full border-2 border-border border-t-[#0d0d0d]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <p className="text-center text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
      <h1 className="mb-6 text-xl font-semibold text-foreground">{title}</h1>
      <div className="flex flex-col gap-2">
        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <div key={message.id} className="flex justify-end py-2">
                <div className="max-w-[80%] rounded-[24px] bg-[#F4F4F4] px-5 py-3 text-sm text-[#0D0D0D]">
                  {message.imageUrl && (
                    <img src={message.imageUrl} alt="Attached" className="mb-2 max-h-64 rounded-xl" />
                  )}
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className="flex gap-3 py-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-1 ring-1 ring-border mt-0.5">
                <LogoMark size={16} />
              </div>
              <div className="min-w-0 flex-1">
                {message.imageUrl ? (
                  <img src={message.imageUrl} alt="Generated" className="max-w-sm rounded-xl border border-border shadow-sm" />
                ) : (
                  <MessageMarkdown content={message.content} />
                )}
                <span className="mt-1 block text-xs text-muted-foreground">
                  {formatTimestamp(new Date(message.createdAt))}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
