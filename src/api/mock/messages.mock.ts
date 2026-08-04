import type { Message } from "@/features/chat/types";
import { delay } from "./delay";

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

const DEMO_REPLY = `Hydration errors usually come from server and client markup not matching. Here are the most common causes:

1. Using \`Date.now()\` or \`Math.random()\` directly during render
2. Reading \`window\` or \`localStorage\` before mount
3. Conditionally rendering based on device size without a mounted check

Let me know which case matches your error and I can go deeper.`;

const messagesByChat: Record<string, Message[]> = {
  "chat-1": [
    {
      id: "m-1",
      chatId: "chat-1",
      role: "user",
      content: "Why am I getting a hydration mismatch error in my Next.js app?",
      createdAt: minutesAgo(42),
    },
    {
      id: "m-2",
      chatId: "chat-1",
      role: "assistant",
      content: DEMO_REPLY,
      createdAt: minutesAgo(41),
      modelId: "gpt-omni",
    },
  ],
  "chat-2": [
    {
      id: "m-3",
      chatId: "chat-2",
      role: "user",
      content: "Give me 3 relaxed weekend trip ideas within a few hours' drive.",
      createdAt: minutesAgo(120),
    },
    {
      id: "m-4",
      chatId: "chat-2",
      role: "assistant",
      content:
        "Here are three low-key options:\n\n- **Lakeside cabin** — hiking by day, board games by night\n- **Small coastal town** — seafood, tide pools, a lighthouse walk\n- **Vineyard countryside** — slow mornings, a tasting flight, long lunches\n\nWant me to tailor these to a specific distance or budget?",
      createdAt: minutesAgo(119),
      modelId: "claude-omni",
    },
  ],
};

export async function fetchMessages(chatId: string): Promise<Message[]> {
  return delay(messagesByChat[chatId] ?? [], 200);
}

export async function appendMessage(message: Message): Promise<Message> {
  const list = messagesByChat[message.chatId] ?? [];
  list.push(message);
  messagesByChat[message.chatId] = list;
  return delay(message, 100);
}

const CANNED_REPLIES = [
  "Here's a way to think about it:\n\n- Start with the core constraint\n- Work outward from there\n- Validate with a small example\n\nWant me to expand on any part of this?",
  "Good question. In short: it depends on the tradeoff between simplicity and flexibility. A minimal approach often wins early on, and you can add structure once real requirements show up.",
  "```ts\nfunction example(input: string): string {\n  return input.trim().toLowerCase();\n}\n```\n\nThis is a small starting point — let me know the exact behavior you need and I'll adjust it.",
];

export async function generateAssistantReply(prompt: string): Promise<string> {
  const reply =
    CANNED_REPLIES[Math.abs(hashCode(prompt)) % CANNED_REPLIES.length];
  return delay(reply, 900);
}

function hashCode(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
