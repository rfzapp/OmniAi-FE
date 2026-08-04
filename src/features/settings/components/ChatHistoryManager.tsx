"use client";

import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { useChat } from "@/features/chat/hooks/useChat";
import { SettingsRow } from "./SettingsRow";

export function ChatHistoryManager() {
  const { chats, deleteChat } = useChat();

  return (
    <>
      <SettingsRow label="Export history" description="Download all your conversations as JSON">
        <Button variant="outline" size="sm" type="button">
          Export
        </Button>
      </SettingsRow>
      <SettingsRow label="Clear all chats" description="Permanently delete every conversation">
        <Button
          variant="destructive"
          size="sm"
          type="button"
          onClick={() => chats.forEach((chat) => void deleteChat(chat.id))}
        >
          Clear all
        </Button>
      </SettingsRow>
      {chats.length > 0 && (
        <div className="px-4 py-2">
          <p className="py-2 text-xs font-medium text-muted-foreground">
            {chats.length} conversation{chats.length === 1 ? "" : "s"}
          </p>
          <div className="flex flex-col divide-y divide-border">
            {chats.map((chat) => (
              <div key={chat.id} className="flex items-center gap-2.5 py-2">
                <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {chat.title}
                </span>
                <IconButton label="Delete chat" onClick={() => void deleteChat(chat.id)}>
                  <Trash2 className="size-3.5" />
                </IconButton>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
