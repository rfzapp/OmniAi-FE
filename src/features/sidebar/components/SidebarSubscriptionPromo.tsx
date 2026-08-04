"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useGoToSubscription } from "@/features/settings/hooks/useGoToSubscription";

/**
 * Dismissal is local component state only (no persistence) — there's no
 * backend/account yet to remember the choice, so it intentionally
 * reappears on refresh, same as the free-prompt usage count.
 */
export function SidebarSubscriptionPromo() {
  const goToSubscription = useGoToSubscription();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative mx-1 mb-2 rounded-xl border border-brand-200 bg-brand-50 p-3 dark:border-brand-900 dark:bg-brand-950/30">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute top-1.5 right-1.5 rounded-md p-1 text-brand-700/60 transition-colors hover:bg-brand-100 hover:text-brand-700 dark:text-brand-300/60 dark:hover:bg-brand-900/40"
      >
        <X className="size-3.5" />
      </button>
      <div className="flex items-center gap-1.5 pr-5">
        <Sparkles className="size-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
        <p className="text-xs font-semibold text-brand-800 dark:text-brand-200">Upgrade to Pro</p>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-brand-700/80 dark:text-brand-300/70">
        Unlock unlimited prompts and every model.
      </p>
      <button
        type="button"
        onClick={goToSubscription}
        className="mt-2 w-full rounded-lg bg-brand-600 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-700"
      >
        See plans
      </button>
    </div>
  );
}
