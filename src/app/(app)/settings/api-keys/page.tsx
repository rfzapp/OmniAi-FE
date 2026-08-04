import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { ApiKeysList } from "@/features/settings/components/ApiKeysList";

export default function ApiKeysSettingsPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-foreground">API Keys</h1>
      <SettingsSection
        title="Bring your own key"
        description="Use your own provider keys instead of OmniAI's shared quota"
      >
        <ApiKeysList />
      </SettingsSection>
    </div>
  );
}
