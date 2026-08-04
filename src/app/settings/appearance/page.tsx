import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { SettingsRow } from "@/features/settings/components/SettingsRow";
import { ThemeSwitcher } from "@/features/settings/components/ThemeSwitcher";

export default function AppearanceSettingsPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-foreground">Appearance</h1>
      <SettingsSection title="Theme" description="Choose how OmniAI looks on this device">
        <SettingsRow label="Interface theme" description="Light, dark, or match your system">
          <ThemeSwitcher />
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
