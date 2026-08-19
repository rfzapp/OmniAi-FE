"use client";

import { SettingsRow } from "./SettingsRow";
import { useAuthStore } from "@/store/useAuthStore";
import { FREE_PROMPT_LIMIT } from "@/config/usage.config";

export function SubscriptionUsageRows() {
  const user = useAuthStore((s) => s.user);

  const subscription = user?.subscription ?? "free";

  let promptText = "";
  let promptBadge = "";

  if (subscription === "free") {
    const promptCount = user?.promptCount ?? 0;
    promptText = `${promptCount} of ${FREE_PROMPT_LIMIT} messages total`;
    promptBadge = `${promptCount} / ${FREE_PROMPT_LIMIT}`;
  } else {
    const promptCount24h = user?.promptCount24h ?? 0;
    let limitMonthly = 100;
    if (subscription === "pro") limitMonthly = 500;
    else if (subscription === "ultra_pro") limitMonthly = 1500;

    promptText = `${promptCount24h} of ${limitMonthly} prompts monthly`;
    promptBadge = `${promptCount24h} / ${limitMonthly}`;
  }

  let attachmentText = "";
  let attachmentBadge = "";
  if (subscription === "free") {
    attachmentText = "Not supported on Free plan";
    attachmentBadge = "0 / 0";
  } else {
    const attachmentCount24h = user?.attachmentCount24h ?? 0;
    let limitMonthly = 3;
    if (subscription === "pro") limitMonthly = 15;
    else if (subscription === "ultra_pro") limitMonthly = 45;

    attachmentText = `${attachmentCount24h} of ${limitMonthly} file attachments monthly`;
    attachmentBadge = `${attachmentCount24h} / ${limitMonthly}`;
  }

  return (
    <div className="flex flex-col gap-4">
      <SettingsRow
        label="Messages sent"
        description={promptText}
      >
        <span className="text-xs text-muted-foreground">{promptBadge}</span>
      </SettingsRow>

      <SettingsRow
        label="File attachments"
        description={attachmentText}
      >
        <span className="text-xs text-muted-foreground">{attachmentBadge}</span>
      </SettingsRow>
    </div>
  );
}
