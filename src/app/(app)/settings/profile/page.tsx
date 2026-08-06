import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { ProfileForm } from "@/features/settings/components/ProfileForm";
import { ChangePasswordForm } from "@/features/settings/components/ChangePasswordForm";

export default function ProfileSettingsPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-foreground">Profile</h1>
      <SettingsSection title="Your details" description="This information is visible across OmniAI">
        <ProfileForm />
      </SettingsSection>
      <SettingsSection title="Password" description="Change the password used to log in">
        <ChangePasswordForm />
      </SettingsSection>
    </div>
  );
}
