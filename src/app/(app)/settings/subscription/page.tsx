import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { SubscriptionPlanCard } from "@/features/settings/components/SubscriptionPlanCard";
import { SubscriptionUsageRows } from "@/features/settings/components/SubscriptionUsageRows";
import { SubscriptionAuthGuard } from "@/features/settings/components/SubscriptionAuthGuard";
import { ImagePlanCard } from "@/features/settings/components/ImagePlanCard";

export default function SubscriptionSettingsPage() {
  return (
    <SubscriptionAuthGuard>
      <div className="flex flex-col gap-6">
        <h1 className="text-lg font-semibold text-foreground">Subscription</h1>

        <SettingsSection title="Chat Plan" description="Manage your OmniAI messaging plan">
          <SubscriptionPlanCard />
        </SettingsSection>

        <SettingsSection
          title="Image Generation Plan"
          description="Separate add-on for AI image generation — available on any chat plan"
        >
          <ImagePlanCard />
        </SettingsSection>

        <SettingsSection title="Usage">
          <SubscriptionUsageRows />
        </SettingsSection>
      </div>
    </SubscriptionAuthGuard>
  );
}
