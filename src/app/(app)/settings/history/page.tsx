import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { ChatHistoryManager } from "@/features/settings/components/ChatHistoryManager";

export default function HistorySettingsPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-foreground">Chat History</h1>
      <SettingsSection title="Manage your history">
        <ChatHistoryManager />
      </SettingsSection>
    </div>
  );
}
