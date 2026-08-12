"use client";

import { useState } from "react";
import { Link2, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/atoms/Button";
import { chatService } from "@/features/chat/services/chatService";

interface ShareChatDialogProps {
  chatId: string;
  chatTitle: string;
  open: boolean;
  onClose: () => void;
}

export function ShareChatDialog({ chatId, chatTitle, open, onClose }: ShareChatDialogProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerateLink() {
    setLoading(true);
    setError(null);
    try {
      const token = await chatService.shareChat(chatId);
      const url = `${window.location.origin}/share/${token}`;
      setShareUrl(url);
    } catch {
      setError("Failed to generate share link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose() {
    setShareUrl(null);
    setCopied(false);
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Share conversation</DialogTitle>
          <DialogDescription className="line-clamp-1 text-sm">
            &ldquo;{chatTitle}&rdquo;
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          {!shareUrl ? (
            <>
              <p className="text-sm text-muted-foreground">
                Anyone with the link can view this conversation. They don&apos;t need an account.
              </p>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={handleGenerateLink} disabled={loading} className="w-full">
                {loading ? "Generating…" : "Create share link"}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Share this link — anyone can view the conversation without logging in.
              </p>
              {/* URL box — w-0 min-w-0 on the span forces truncation inside flex */}
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">
                <Link2 className="size-4 shrink-0 text-muted-foreground" />
                <p className="w-0 min-w-0 flex-1 truncate text-sm text-foreground select-all">
                  {shareUrl}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCopy} className="flex-1" variant={copied ? "outline" : "default"}>
                  {copied ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="size-4" /> Copied!
                    </span>
                  ) : (
                    "Copy link"
                  )}
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  <X className="size-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
