import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { SubscriptionPlanCard } from "@/features/settings/components/SubscriptionPlanCard";
import { SettingsRow } from "@/features/settings/components/SettingsRow";
import { SubscriptionAuthGuard } from "@/features/settings/components/SubscriptionAuthGuard";

export default function SubscriptionSettingsPage() {
  return (
    <SubscriptionAuthGuard>
      <div>
        <h1 className="mb-4 text-lg font-semibold text-foreground">Subscription</h1>
        <SettingsSection title="Plan" description="You're currently on the Pro plan">
          <SubscriptionPlanCard />
        </SettingsSection>
        <SettingsSection title="Usage this month">
          <SettingsRow label="Messages sent" description="1,204 of unlimited">
            <span className="text-xs text-muted-foreground">Unlimited</span>
          </SettingsRow>
          <SettingsRow label="Next billing date" description="Renews automatically">
            <span className="text-xs text-muted-foreground">Sep 3, 2026</span>
          </SettingsRow>
        </SettingsSection>
      </div>
    </SubscriptionAuthGuard>
  );
}
