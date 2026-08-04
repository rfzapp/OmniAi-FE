"use client";

import { useRef } from "react";
import { ArrowUp, Globe, Paperclip, Sparkles } from "lucide-react";
import { Textarea } from "@/components/atoms/Textarea";
import { IconButton } from "@/components/atoms/IconButton";
import { PromptToolbarButton } from "@/components/molecules/PromptToolbarButton";
import { ModelSelectorDropdown } from "./ModelSelectorDropdown";
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
  const {
    value,
    setValue,
    submit,
    handleKeyDown,
    attachments,
    addAttachment,
    removeAttachment,
    webSearchEnabled,
    toggleWebSearch,
    reasoningEnabled,
    toggleReasoning,
  } = useComposerSubmit({ onSend, disabled });
  const textareaRef = useAutoGrowTextarea(value);

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border bg-card shadow-sm transition-shadow focus-within:shadow-md",
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
        className="min-h-11 resize-none border-0 bg-transparent px-3.5 pt-3 pb-1 text-sm shadow-none focus-visible:ring-0 md:text-base"
      />

      <div className="flex items-center justify-between gap-2 px-2 pb-2">
        <div className="flex flex-wrap items-center gap-1">
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
          <IconButton label="Attach file" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="size-4" />
          </IconButton>
          <ModelSelectorDropdown />
          <PromptToolbarButton
            icon={Globe}
            label="Web Search"
            active={webSearchEnabled}
            onClick={toggleWebSearch}
          />
          <PromptToolbarButton
            icon={Sparkles}
            label="Reasoning"
            active={reasoningEnabled}
            onClick={toggleReasoning}
          />
        </div>

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
