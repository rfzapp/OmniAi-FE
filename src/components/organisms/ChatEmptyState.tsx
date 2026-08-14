"use client";

import { motion } from "framer-motion";
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
    <div className="flex w-full flex-1 flex-col overflow-y-auto">
      {/* Centre section — tagline + prompt composer */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 py-6 min-h-0">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center text-lg font-medium text-muted-foreground sm:text-xl"
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex w-full flex-col items-center gap-3"
        >
          <span className={badgeClass}>
            <Zap className="size-3.5" />
            {displayMsg}
          </span>

          <ComposerBar onSend={onSend} disabled={disabled} />
        </motion.div>
      </div>

      {/* Feature cards — compact secondary row above global footer */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full border-t border-border/40 bg-background px-4 py-3"
      >
        <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-2.5 sm:grid-cols-4">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="group flex flex-col gap-2 rounded-lg border border-border/50 bg-card/60 p-3 transition-all duration-200 hover:border-border hover:bg-card hover:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md", card.iconBg)}>
                  <card.icon className={cn("size-3.5", card.iconColor)} />
                </div>
                <h3 className="text-xs font-semibold text-foreground leading-tight truncate">{card.title}</h3>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{card.description}</p>
              <a
                href={card.link}
                className="mt-auto text-[11px] font-medium text-brand-600 hover:underline flex items-center gap-0.5 group-hover:gap-1 transition-all"
              >
                Learn more <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
