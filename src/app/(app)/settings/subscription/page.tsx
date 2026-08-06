import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { SubscriptionPlanCard } from "@/features/settings/components/SubscriptionPlanCard";
import { SubscriptionUsageRows } from "@/features/settings/components/SubscriptionUsageRows";
import { SubscriptionAuthGuard } from "@/features/settings/components/SubscriptionAuthGuard";

export default function SubscriptionSettingsPage() {
  return (
    <SubscriptionAuthGuard>
      <div>
        <h1 className="mb-4 text-lg font-semibold text-foreground">Subscription</h1>
        <SettingsSection title="Plan" description="Manage your OmniAI plan">
          <SubscriptionPlanCard />
        </SettingsSection>
        <SettingsSection title="Usage">
          <SubscriptionUsageRows />
        </SettingsSection>
      </div>
    </SubscriptionAuthGuard>
  );
}
