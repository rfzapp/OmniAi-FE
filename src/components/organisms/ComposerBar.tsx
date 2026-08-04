import { ModelChips } from "@/features/models/components/ModelChips";
import { PromptComposer } from "./PromptComposer";
import { cn } from "@/lib/utils";

interface ComposerBarProps {
  onSend: (content: string) => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}

/**
 * Model chips + prompt composer, paired together so switching models is
 * available everywhere a user can send a message — the new-chat hero and
 * an active chat thread alike, not just at conversation start.
 */
export function ComposerBar({ onSend, disabled, className }: ComposerBarProps) {
  return (
    <div className={cn("flex w-full flex-col items-center gap-2.5", className)}>
      <ModelChips />
      <PromptComposer onSend={onSend} disabled={disabled} />
    </div>
  );
}
