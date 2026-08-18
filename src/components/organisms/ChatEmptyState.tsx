"use client";

import { Zap, Star, ShieldCheck, Bolt, Users } from "lucide-react";
import { ComposerBar } from "./ComposerBar";
import { useRemainingFreePrompts } from "@/store/useUsageStore";
import { useAuthStore } from "@/store/useAuthStore";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface Attachment {
  id: string;
  name: string;
  size: number;
  type?: string;
  file?: File;
}

interface ChatEmptyStateProps {
  onSend: (content: string, attachments?: Attachment[]) => void | Promise<void>;
  disabled?: boolean;
  statusMessage?: string;
  statusIsError?: boolean;
}

const featureCards = [
  {
    icon: Star,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
    title: "One Subscription",
    description: "Access multiple leading AI models with a single subscription.",
    link: "#",
  },
  {
    icon: ShieldCheck,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    title: "Your Data, Your Control",
    description: "We don't store your prompts. Your data stays private and secure.",
    link: "#",
  },
  {
    icon: Bolt,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    title: "Faster, Smarter, Better",
    description: "Compare models side-by-side and get the best answers, every time.",
    link: "#",
  },
  {
    icon: Users,
    iconColor: "text-sky-500",
    iconBg: "bg-sky-50",
    title: "Built for Productivity",
    description: "All the tools you need to work smarter and get things done.",
    link: "#",
  },
];

export function ChatEmptyState({ onSend, disabled, statusMessage, statusIsError }: ChatEmptyStateProps) {
  const remaining = useRemainingFreePrompts();
  const subscription = useAuthStore((s) => s.user?.subscription ?? "free");
  const limitReached = remaining <= 0;
  const isFree = subscription === "free";

  let displayMsg = statusMessage;
  if (!displayMsg) {
    if (isFree) {
      displayMsg = limitReached
        ? "You've used all your free prompts"
        : `You have ${remaining} free prompt${remaining === 1 ? "" : "s"} remaining`;
    } else {
      const planName =
        subscription === "ultra_pro" ? "Ultra Pro"
          : subscription === "pro" ? "Pro"
            : "Standard";
      displayMsg = limitReached
        ? `You've used all your prompts for today (${planName} plan)`
        : `You have ${remaining} prompt${remaining === 1 ? "" : "s"} remaining for today`;
    }
  }

  const badgeClass = cn(
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
    statusIsError
      ? "border-red-200 bg-red-50 text-red-700"
      : limitReached
        ? "border-red-200 bg-red-50 text-red-700"
        : remaining <= (isFree ? 1 : 10)
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-border bg-muted text-foreground"
  );

  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-y-auto">
      {/* Top — tagline + composer */}
      <div className="flex flex-col items-center gap-5 px-4 pt-10 pb-6 sm:pt-14 sm:pb-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-2xl font-semibold text-foreground sm:text-3xl">
            {siteConfig.tagline}
          </p>
          <span className={badgeClass}>
            <Zap className="size-3.5" />
            {displayMsg}
          </span>
        </div>
        <div className="w-full max-w-2xl">
          <ComposerBar onSend={onSend} disabled={disabled} />
        </div>
      </div>

      {/* Bottom — feature cards */}
      <div className="px-4 pb-6 sm:px-6">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-foreground/20 hover:shadow-md"
            >
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", card.iconBg)}>
                <card.icon className={cn("size-5", card.iconColor)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
              <a
                href={card.link}
                className="mt-auto text-xs font-medium text-foreground/60 hover:text-foreground flex items-center gap-1 transition-all group-hover:gap-1.5"
              >
                Learn more <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
