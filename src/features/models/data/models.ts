import chatgptLogo from "@/assets/logos/chatgpt.webp";
import claudeLogo from "@/assets/logos/claude.png";
import deepseekLogo from "@/assets/logos/deepseek.png";
import geminiLogo from "@/assets/logos/gemini.png";
import grokLogo from "@/assets/logos/grok.jpg";
import kimiLogo from "@/assets/logos/kimi.jpg";
import llamaLogo from "@/assets/logos/llama.png";
import mistralLogo from "@/assets/logos/mistral.png";
import qwenLogo from "@/assets/logos/qwen.webp";
import type { AiModel } from "../types";

export interface GptVariant {
  id: string;
  name: string;
  description: string;
  badge?: string;
  speed: "fast" | "standard" | "slower";
}

export const GPT_VARIANTS: GptVariant[] = [
  {
    id: "gpt-5.6-luna",
    name: "GPT-5.6 Luna",
    description: "Lightweight, ultra-fast response model",
    badge: "Luna",
    speed: "fast",
  },
  {
    id: "gpt-5.6-terra",
    name: "GPT-5.6 Terra",
    description: "High performance for complex math, coding & reasoning",
    badge: "Terra",
    speed: "standard",
  },
  {
    id: "gpt-5.6-sol",
    name: "GPT-5.6 Sol",
    description: "Balanced reasoning & creative problem solving",
    badge: "Sol",
    speed: "fast",
  },
];

export interface ClaudeVariant {
  id: string;
  name: string;
  description: string;
  badge?: string;
  speed: "fast" | "standard" | "slower";
}

export const CLAUDE_VARIANTS: ClaudeVariant[] = [
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    description: "Fastest and most affordable — high volume everyday tasks",
    badge: "Haiku",
    speed: "fast",
  },
  {
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    description: "Everyday tasks, writing, and cost-efficient performance",
    badge: "Sonnet",
    speed: "standard",
  },
  {
    id: "claude-fable-5",
    name: "Claude Fable 5",
    description: "Most capable model — research, multi-day and complex tasks",
    badge: "Fable",
    speed: "slower",
  },
  {
    id: "claude-opus-5",
    name: "Claude Opus 5",
    description: "Complex projects, coding and agentic workflows",
    badge: "Opus",
    speed: "slower",
  },
];

export const AI_MODELS: AiModel[] = [
  {
    id: "gpt-omni",
    provider: "OpenAI",
    name: "GPT",
    description: "Versatile all-rounder, strong at reasoning and coding",
    speed: "standard",
    logo: chatgptLogo,
    color: "#10A37F",
    available: true,
  },
  {
    id: "claude-omni",
    provider: "Anthropic",
    name: "Claude",
    description: "Thoughtful, careful writing and long-context analysis",
    speed: "standard",
    logo: claudeLogo,
    color: "#D97757",
    available: true,
  },
  {
    id: "gemini-omni",
    provider: "Google",
    name: "Gemini",
    description: "Multimodal reasoning with fast turnaround",
    speed: "fast",
    logo: geminiLogo,
    color: "#4285F4",
    available: false,
  },
  {
    id: "deepseek-omni",
    provider: "DeepSeek",
    name: "DeepSeek",
    description: "Efficient reasoning model, great for math and code",
    speed: "fast",
    logo: deepseekLogo,
    color: "#4D6BFE",
    available: false,
  },
  {
    id: "kimi-omni",
    provider: "Moonshot AI",
    name: "Kimi",
    description: "Long-context specialist for large documents",
    speed: "standard",
    logo: kimiLogo,
    color: "#0F9D8B",
    available: false,
  },
  {
    id: "grok-omni",
    provider: "xAI",
    name: "Grok",
    description: "Real-time knowledge with a conversational edge",
    speed: "fast",
    logo: grokLogo,
    color: "#111827",
    available: false,
  },
  {
    id: "llama-omni",
    provider: "Meta",
    name: "Llama",
    description: "Open-weight model tuned for flexibility",
    speed: "fast",
    logo: llamaLogo,
    color: "#0668E1",
    available: false,
  },
  {
    id: "mistral-omni",
    provider: "Mistral AI",
    name: "Mistral",
    description: "Lightweight and fast for everyday tasks",
    speed: "fast",
    logo: mistralLogo,
    color: "#FA5B0F",
    available: false,
  },
  {
    id: "qwen-omni",
    provider: "Alibaba",
    name: "Qwen",
    description: "Strong multilingual and coding performance",
    speed: "slower",
    logo: qwenLogo,
    color: "#6C5CE7",
    available: false,
  },
];
