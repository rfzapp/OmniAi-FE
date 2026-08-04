import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { ModelConnectionsList } from "@/features/settings/components/ModelConnectionsList";

export default function ModelsSettingsPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-foreground">Connected AI Models</h1>
      <SettingsSection
        title="Providers"
        description="Choose which models appear in the model selector"
      >
        <ModelConnectionsList />
      </SettingsSection>
    </div>
  );
}
