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
    let limit24h = 100;
    if (subscription === "pro") limit24h = 500;
    else if (subscription === "ultra_pro") limit24h = 1500;

    promptText = `${promptCount24h} of ${limit24h} prompts daily`;
    promptBadge = `${promptCount24h} / ${limit24h}`;
  }

  let attachmentText = "";
  let attachmentBadge = "";
  if (subscription === "free") {
    attachmentText = "Not supported on Free plan";
    attachmentBadge = "0 / 0";
  } else {
    const attachmentCount24h = user?.attachmentCount24h ?? 0;
    let limit24h = 3;
    if (subscription === "pro") limit24h = 15;
    else if (subscription === "ultra_pro") limit24h = 45;

    attachmentText = `${attachmentCount24h} of ${limit24h} file attachments daily`;
    attachmentBadge = `${attachmentCount24h} / ${limit24h}`;
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
