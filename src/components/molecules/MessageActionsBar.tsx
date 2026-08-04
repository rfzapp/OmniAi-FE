"use client";

import { RotateCcw, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { CopyButton } from "./CopyButton";
import { ModelBadge } from "./ModelBadge";
import { formatTimestamp } from "@/lib/date";
import type { Message } from "@/features/chat/types";

interface MessageActionsBarProps {
  message: Message;
  onRegenerate?: () => void;
  onToggleLike?: () => void;
  onToggleDislike?: () => void;
  onShare?: () => void;
}

export function MessageActionsBar({
  message,
  onRegenerate,
  onToggleLike,
  onToggleDislike,
  onShare,
}: MessageActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 text-muted-foreground">
      <CopyButton text={message.content} label="Copy" />
      {onRegenerate && (
        <IconButton label="Regenerate" onClick={onRegenerate}>
          <RotateCcw className="size-3.5" />
        </IconButton>
      )}
      {onToggleLike && (
        <IconButton label="Like" active={message.liked} onClick={onToggleLike}>
          <ThumbsUp className="size-3.5" />
        </IconButton>
      )}
      {onToggleDislike && (
        <IconButton label="Dislike" active={message.disliked} onClick={onToggleDislike}>
          <ThumbsDown className="size-3.5" />
        </IconButton>
      )}
      {onShare && (
        <IconButton label="Share" onClick={onShare}>
          <Share2 className="size-3.5" />
        </IconButton>
      )}
      <ModelBadge modelId={message.modelId} />
      <span className="ml-1 text-xs text-muted-foreground/70">
        {formatTimestamp(new Date(message.createdAt))}
      </span>
    </div>
  );
}
