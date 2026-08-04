"use client";

import { useCallback, useState, type KeyboardEvent } from "react";
import type { Attachment } from "../types";

interface UseComposerSubmitOptions {
  onSend: (content: string) => void | Promise<void>;
  disabled?: boolean;
}

export function useComposerSubmit({ onSend, disabled }: UseComposerSubmitOptions) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    void onSend(trimmed);
    setValue("");
    setAttachments([]);
  }, [value, disabled, onSend]);

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
    setAttachments((prev) => [
      ...prev,
      ...Array.from(files).map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}`,
        name: file.name,
        size: file.size,
      })),
    ]);
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
