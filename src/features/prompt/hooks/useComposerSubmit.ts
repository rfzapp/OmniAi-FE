"use client";

import { useCallback, useState, type KeyboardEvent } from "react";
import type { Attachment } from "../types";

interface UseComposerSubmitOptions {
  onSend: (content: string, attachments?: Attachment[]) => void | Promise<void>;
  disabled?: boolean;
}

const MAX_ATTACHMENT_SIZE_BYTES = 3 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

function normalizeFile(file: File): Attachment | null {
  const mime = file.type || "application/octet-stream";
  const lower = file.name.toLowerCase();
  const isPdf = lower.endsWith(".pdf") || mime === "application/pdf";
  const isWord = lower.endsWith(".doc") || lower.endsWith(".docx") || mime === "application/msword" || mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isExcel = lower.endsWith(".xls") || lower.endsWith(".xlsx") || mime === "application/vnd.ms-excel" || mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const isImage = mime.startsWith("image/");

  if (!isImage && !isPdf && !isWord && !isExcel) return null;
  if (!ALLOWED_MIME_TYPES.has(mime) && !(isPdf || isWord || isExcel || isImage)) return null;
  if (file.size > MAX_ATTACHMENT_SIZE_BYTES) return null;

  return {
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    size: file.size,
    type: mime,
    file,
  };
}

export function useComposerSubmit({ onSend, disabled }: UseComposerSubmitOptions) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const submit = useCallback(() => {
    const trimmed = value.trim();
    const hasAttachments = attachments.length > 0;
    if ((!trimmed && !hasAttachments) || disabled) return;
    void onSend(trimmed, attachments);
    setValue("");
    setAttachments([]);
  }, [value, attachments, disabled, onSend]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submit();
      }
    },
    [submit]
  );

  const addAttachment = useCallback((files: FileList | null) => {
    if (!files) return;

    const next = Array.from(files)
      .map((file) => normalizeFile(file))
      .filter((file): file is Attachment => Boolean(file));

    setAttachments((prev) => [...prev, ...next]);
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    value,
    setValue,
    submit,
    handleKeyDown,
    attachments,
    addAttachment,
    removeAttachment,
  };
}
