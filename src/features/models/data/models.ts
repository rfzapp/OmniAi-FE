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

export interface ProviderVariant {
  id: string;
  name: string;
  description: string;
  badge?: string;
  speed: "fast" | "standard" | "slower";
}

export const DEEPSEEK_VARIANTS: ProviderVariant[] = [
  {
    id: "deepseek-chat",
    name: "DeepSeek V3",
    description: "Fast and capable — everyday tasks and coding",
    badge: "V3",
    speed: "fast",
  },
  {
    id: "deepseek-reasoner",
    name: "DeepSeek R1",
    description: "Advanced reasoning and complex problem solving",
    badge: "R1",
    speed: "slower",
  },
];

export const GROK_VARIANTS: ProviderVariant[] = [
  {
    id: "grok-4",
    name: "Grok 4.6",
    description: "Flagship model — long-horizon agentic coding and real-world knowledge",
    badge: "4.6",
    speed: "standard",
  },
  {
    id: "grok-3",
    name: "Grok 4.3",
    description: "Chat model with 1M context — great for long documents",
    badge: "4.3",
    speed: "fast",
  },
];

export const QWEN_VARIANTS: ProviderVariant[] = [
  {
    id: "qwen-max",
    name: "Qwen Max",
    description: "Most capable Qwen — complex reasoning and long context",
    badge: "Max",
    speed: "standard",
  },
  {
    id: "qwen-plus",
    name: "Qwen Plus",
    description: "Balanced performance for everyday tasks",
    badge: "Plus",
    speed: "fast",
  },
  {
    id: "qwen-turbo",
    name: "Qwen Turbo",
    description: "Fastest and most cost-efficient Qwen model",
    badge: "Turbo",
    speed: "fast",
  },
];

export const MISTRAL_VARIANTS: ProviderVariant[] = [
  {
    id: "mistral-large-latest",
    name: "Mistral Large",
    description: "Most capable Mistral — complex tasks and reasoning",
    badge: "Large",
    speed: "standard",
  },
  {
    id: "mistral-small-latest",
    name: "Mistral Small",
    description: "Fast and efficient for everyday tasks",
    badge: "Small",
    speed: "fast",
  },
];

export const KIMI_VARIANTS: ProviderVariant[] = [
  {
    id: "kimi-k3",
    name: "Kimi K3",
    description: "Flagship model — 1M context, frontier coding and reasoning",
    badge: "K3",
    speed: "standard",
  },
  {
    id: "kimi-k2.6",
    name: "Kimi K2.6",
    description: "Balanced performance with long-context capability",
    badge: "K2.6",
    speed: "fast",
  },
  {
    id: "moonshot-v1-128k",
    name: "Kimi 128K",
    description: "128K context window — ideal for large documents",
    badge: "128K",
    speed: "standard",
  },
];
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
    id: "claude-opus-5",
    name: "Claude Opus 5",
    description: "Complex projects, coding and agentic workflows",
    badge: "Opus",
    speed: "slower",
  },
  {
    id: "claude-fable-5",
    name: "Claude Fable 5",
    description: "Most capable model — research, multi-day and complex tasks",
    badge: "Fable",
    speed: "slower",
  },
];

export const AI_MODELS: AiModel[] = [
  { id: "gpt-omni",      provider: "OpenAI",      name: "GPT",      description: "Versatile all-rounder, strong at reasoning and coding",   speed: "standard", logo: chatgptLogo,  color: "#10A37F", available: true  },
  { id: "claude-omni",   provider: "Anthropic",   name: "Claude",   description: "Thoughtful, careful writing and long-context analysis",   speed: "standard", logo: claudeLogo,   color: "#D97757", available: true  },
  { id: "deepseek-omni", provider: "DeepSeek",    name: "DeepSeek", description: "Efficient reasoning model, great for math and code",      speed: "fast",     logo: deepseekLogo, color: "#4D6BFE", available: true  },
  { id: "grok-omni",     provider: "xAI",         name: "Grok",     description: "Real-time knowledge with a conversational edge",          speed: "fast",     logo: grokLogo,     color: "#111827", available: true  },
  { id: "qwen-omni",     provider: "Alibaba",     name: "Qwen",     description: "Strong multilingual and coding performance",              speed: "fast",     logo: qwenLogo,     color: "#6C5CE7", available: true  },
  { id: "mistral-omni",  provider: "Mistral AI",  name: "Mistral",  description: "Lightweight and fast for everyday tasks",                 speed: "fast",     logo: mistralLogo,  color: "#FA5B0F", available: true  },
  { id: "kimi-omni",     provider: "Moonshot AI", name: "Kimi",     description: "Long-context specialist for large documents",             speed: "standard", logo: kimiLogo,     color: "#0F9D8B", available: true  },
  { id: "gemini-omni",   provider: "Google",      name: "Gemini",   description: "Multimodal reasoning with fast turnaround",               speed: "fast",     logo: geminiLogo,   color: "#4285F4", available: false },
  { id: "llama-omni",    provider: "Meta",        name: "Llama",    description: "Open-weight model tuned for flexibility",                 speed: "fast",     logo: llamaLogo,    color: "#0668E1", available: false },
];
