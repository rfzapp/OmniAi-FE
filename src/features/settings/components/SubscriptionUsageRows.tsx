"use client";

import { SettingsRow } from "./SettingsRow";
import { useAuthStore } from "@/store/useAuthStore";
import { FREE_PROMPT_LIMIT } from "@/config/usage.config";

export function SubscriptionUsageRows() {
  const user = useAuthStore((s) => s.user);
  const isUnlimited = user?.subscription !== "free";
  const promptCount = user?.promptCount ?? 0;

  return (
    <SettingsRow
      label="Messages sent"
      description={isUnlimited ? `${promptCount} sent — unlimited plan` : `${promptCount} of ${FREE_PROMPT_LIMIT}`}
    >
      <span className="text-xs text-muted-foreground">{isUnlimited ? "Unlimited" : `${promptCount} / ${FREE_PROMPT_LIMIT}`}</span>
    </SettingsRow>
  );
}
