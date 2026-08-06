"use client";

import { useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChat } from "@/features/chat/hooks/useChat";
import { chatService } from "@/features/chat/services/chatService";
import { getApiErrorMessage } from "@/services/httpClient";
import { SettingsRow } from "./SettingsRow";

export function ChatHistoryManager() {
  const { chats, deleteChat } = useChat();
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setError(null);
    setIsExporting(true);
    try {
      const conversations = await Promise.all(
        chats.map(async (chat) => ({
          ...chat,
          messages: await chatService.listMessages(chat.id),
        })),
      );
      const blob = new Blob([JSON.stringify(conversations, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `omniai-conversations-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsExporting(false);
    }
  }

  async function handleClearAll() {
    setError(null);
    setIsClearing(true);
    try {
      await Promise.all(chats.map((chat) => deleteChat(chat.id)));
      setConfirmOpen(false);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <>
      <SettingsRow label="Export history" description="Download all your conversations as JSON">
        <Button variant="outline" size="sm" type="button" onClick={handleExport} disabled={isExporting || chats.length === 0}>
          {isExporting ? "Exporting…" : "Export"}
        </Button>
      </SettingsRow>
      <SettingsRow label="Clear all chats" description="Permanently delete every conversation">
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <Button
            variant="destructive"
            size="sm"
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={chats.length === 0}
          >
            Clear all
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete every conversation?</DialogTitle>
              <DialogDescription>
                This permanently deletes all {chats.length} conversation{chats.length === 1 ? "" : "s"}. This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
              <Button variant="destructive" onClick={handleClearAll} disabled={isClearing}>
                {isClearing ? "Deleting…" : "Delete all"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SettingsRow>

      {error && (
        <p role="alert" className="mx-4 my-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

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
