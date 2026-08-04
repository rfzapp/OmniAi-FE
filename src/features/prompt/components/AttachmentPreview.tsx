"use client";

import { FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Attachment } from "../types";

interface AttachmentPreviewProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentPreview({ attachments, onRemove }: AttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-1 pb-2">
      <AnimatePresence initial={false}>
        {attachments.map((attachment) => (
          <motion.div
            key={attachment.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 py-1.5 pr-1.5 pl-2 text-xs"
          >
            <FileText className="size-3.5 text-muted-foreground" />
            <span className="max-w-32 truncate">{attachment.name}</span>
            <span className="text-muted-foreground">{formatSize(attachment.size)}</span>
            <button
              type="button"
              onClick={() => onRemove(attachment.id)}
              aria-label={`Remove ${attachment.name}`}
              className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
