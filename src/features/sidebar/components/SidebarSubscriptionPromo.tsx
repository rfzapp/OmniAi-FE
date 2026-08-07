"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useGoToSubscription } from "@/features/settings/hooks/useGoToSubscription";
import { useIsUnlimitedPlan } from "@/store/useUsageStore";

/**
 * Dismissal is local component state only (no persistence) — reappears on
 * refresh. Hidden entirely once the account is actually on a paid plan.
 */
export function SidebarSubscriptionPromo() {
  const goToSubscription = useGoToSubscription();
  const [dismissed, setDismissed] = useState(false);
  const isUnlimited = useIsUnlimitedPlan();

  if (dismissed || isUnlimited) return null;

  return (
    <div className="relative mx-1 mb-2 rounded-xl border border-border bg-muted/50 p-3">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        suppressHydrationWarning
        className="absolute top-1.5 right-1.5 rounded-md p-1 text-foreground/40 transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
      <div className="flex items-center gap-1.5 pr-5">
        <Sparkles className="size-3.5 shrink-0 text-foreground" />
        <p className="text-xs font-semibold text-foreground">Upgrade to Pro</p>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
        Unlock unlimited prompts and every model.
      </p>
      <button
        type="button"
        onClick={goToSubscription}
        suppressHydrationWarning
        className="mt-2 w-full rounded-lg bg-[#0d0d0d] py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#2a2a2a]"
      >
        See plans
      </button>
    </div>
  );
}
