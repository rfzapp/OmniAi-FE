"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Square, Plus, Paperclip, Image, FileText, Camera, Globe } from "lucide-react";
import { Textarea } from "@/components/atoms/Textarea";
import { IconButton } from "@/components/atoms/IconButton";
import { AttachmentPreview } from "@/features/prompt/components/AttachmentPreview";
import { useComposerSubmit } from "@/features/prompt/hooks/useComposerSubmit";
import { useAutoGrowTextarea } from "@/features/prompt/hooks/useAutoGrowTextarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PromptComposerProps {
  onSend: (content: string, attachments?: Attachment[]) => void | Promise<void>;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type?: string;
  file?: File;
}

export function PromptComposer({
  onSend,
  onStop,
  isStreaming,
  disabled,
  placeholder = "Ask me anything",
  className,
}: PromptComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { value, setValue, submit, handleKeyDown, attachments, addAttachment, removeAttachment } =
    useComposerSubmit({ onSend, disabled });
  const textareaRef = useAutoGrowTextarea(value);
  const [activePlaceholder, setActivePlaceholder] = useState(0);

  const rotatingPlaceholders = [
    "Ask OmniAI to plan a launch and turn this idea into a roadmap",
    "Summarize this report and highlight action items",
    "Draft a reply that is clear, concise, and professional",
    "Design a workflow and map the next best step",
    "Create smart automation and decide what should happen first",
  ];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActivePlaceholder((current) => (current + 1) % rotatingPlaceholders.length);
    }, 5200);
    return () => window.clearInterval(intervalId);
  }, []);

  const menuItems = [
    {
      icon: Paperclip,
      label: "Attach file",
      description: "PDF, Word, Excel…",
      onClick: () => fileInputRef.current?.click(),
    },
    {
      icon: Image,
      label: "Upload image",
      description: "PNG, JPEG, WEBP, GIF",
      onClick: () => imageInputRef.current?.click(),
    },
    {
      icon: Camera,
      label: "Take photo",
      description: "Use device camera",
      onClick: () => {
        /* future: camera capture */
      },
    },
    {
      icon: Globe,
      label: "Browse the web",
      description: "Add a URL as context",
      onClick: () => {
        /* future: URL context */
      },
    },
    {
      icon: FileText,
      label: "Create document",
      description: "Start with a template",
      onClick: () => {
        /* future: templates */
      },
    },
  ];

  return (
    <div className={cn("rainbow-border w-full rounded-2xl bg-card shadow-sm")}>
      <AttachmentPreview attachments={attachments} onRemove={removeAttachment} />

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="application/pdf,.doc,.docx,.xls,.xlsx"
        className="hidden"
        onChange={(e) => {
          addAttachment(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          addAttachment(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="flex items-center gap-1 px-2 py-1">
        {/* + Dropdown trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <IconButton
                label="Add attachment or action"
                disabled={disabled}
                className="shrink-0"
              >
                <Plus className="size-4" />
              </IconButton>
            }
          />
          <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-56">
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground pb-1">
              Add to conversation
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {menuItems.map((item) => (
              <DropdownMenuItem
                key={item.label}
                onClick={item.onClick}
                className="flex items-start gap-3 py-2"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                  <item.icon className="size-3.5 text-foreground/70" />
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="text-sm font-medium leading-tight">{item.label}</span>
                  <span className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                    {item.description}
                  </span>
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={rotatingPlaceholders[activePlaceholder] ?? placeholder}
          rows={1}
          disabled={disabled}
          className="min-h-9 flex-1 resize-none border-0 bg-transparent px-1.5 py-1.5 text-sm shadow-none focus-visible:ring-0 md:text-base"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop response"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0d0d0d] text-white transition-transform hover:scale-105 hover:bg-[#2a2a2a]"
          >
            <Square className="size-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={disabled || (!value.trim() && attachments.length === 0)}
            aria-label="Send message"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0d0d0d] text-white transition-transform enabled:hover:scale-105 enabled:hover:bg-[#2a2a2a] disabled:opacity-30"
          >
            <ArrowUp className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
