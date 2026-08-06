import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { SettingsRow } from "@/features/settings/components/SettingsRow";
import { ModelConnectionsList } from "@/features/settings/components/ModelConnectionsList";
import { DefaultModelSelect } from "@/features/settings/components/DefaultModelSelect";

export default function ModelsSettingsPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-foreground">Connected AI Models</h1>
      <SettingsSection title="Default model" description="Used whenever you start a new chat">
        <SettingsRow label="Default model" description="Only models with a connected provider can be selected">
          <DefaultModelSelect />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection
        title="Providers"
        description="Choose which models appear in the model selector"
      >
        <ModelConnectionsList />
      </SettingsSection>
    </div>
  );
}
