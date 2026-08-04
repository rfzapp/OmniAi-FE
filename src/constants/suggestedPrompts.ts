import type { LucideIcon } from "lucide-react";
import { Sparkles, Code2, NotebookPen, Lightbulb } from "lucide-react";

export interface SuggestedPrompt {
  id: string;
  title: string;
  prompt: string;
  icon: LucideIcon;
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: "explain-concept",
    title: "Explain a concept",
    prompt: "Explain quantum entanglement like I'm a curious beginner.",
    icon: Lightbulb,
  },
  {
    id: "write-code",
    title: "Write code",
    prompt: "Write a TypeScript function that debounces async calls.",
    icon: Code2,
  },
  {
    id: "draft-copy",
    title: "Draft something",
    prompt: "Draft a friendly launch announcement for a new product.",
    icon: NotebookPen,
  },
  {
    id: "brainstorm",
    title: "Brainstorm ideas",
    prompt: "Brainstorm five original names for an AI productivity app.",
    icon: Sparkles,
  },
];
