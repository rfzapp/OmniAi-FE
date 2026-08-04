"use client";

import { useRef } from "react";
import { ArrowUp, Paperclip } from "lucide-react";
import { Textarea } from "@/components/atoms/Textarea";
import { IconButton } from "@/components/atoms/IconButton";
import { AttachmentPreview } from "@/features/prompt/components/AttachmentPreview";
import { useComposerSubmit } from "@/features/prompt/hooks/useComposerSubmit";
import { useAutoGrowTextarea } from "@/features/prompt/hooks/useAutoGrowTextarea";
import { cn } from "@/lib/utils";

interface PromptComposerProps {
  onSend: (content: string) => void | Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function PromptComposer({
  onSend,
  disabled,
  placeholder = "Message OmniAI…",
  className,
}: PromptComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { value, setValue, submit, handleKeyDown, attachments, addAttachment, removeAttachment } =
    useComposerSubmit({ onSend, disabled });
  const textareaRef = useAutoGrowTextarea(value);

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-200 focus-within:border-brand-300 focus-within:shadow-[0_0_0_4px_rgba(124,92,252,0.1)]",
        className
      )}
    >
      <AttachmentPreview attachments={attachments} onRemove={removeAttachment} />

      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={disabled}
        className="min-h-12 resize-none border-0 bg-transparent px-4 pt-3.5 pb-1 text-sm shadow-none focus-visible:ring-0 md:text-base"
      />

      <div className="flex items-center justify-between gap-2 px-2.5 pb-2.5">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            addAttachment(e.target.files);
            e.target.value = "";
          }}
        />
        <IconButton
          label="Attach file"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Paperclip className="size-4" />
        </IconButton>

        <button
          type="button"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform enabled:hover:scale-105 disabled:opacity-40"
        >
          <ArrowUp className="size-4" />
        </button>
      </div>
    </div>
  );
}
