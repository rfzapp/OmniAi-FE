import { ModelChips } from "@/features/models/components/ModelChips";
import { PromptComposer } from "./PromptComposer";
import { cn } from "@/lib/utils";

interface Attachment {
  id: string;
  name: string;
  size: number;
  type?: string;
  file?: File;
}

interface ComposerBarProps {
  onSend: (content: string, attachments?: Attachment[]) => void | Promise<void>;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ComposerBar({ onSend, onStop, isStreaming, disabled, className }: ComposerBarProps) {
  return (
    <div className={cn("flex w-full flex-col items-center gap-2.5", className)}>
      <ModelChips />
      <PromptComposer onSend={onSend} onStop={onStop} isStreaming={isStreaming} disabled={disabled} />
    </div>
  );
}
