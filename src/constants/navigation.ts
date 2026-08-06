import type { LucideIcon } from "lucide-react";
import {
  User,
  Palette,
  Cpu,
  KeyRound,
  History,
  BrainCircuit,
  Bell,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ROUTES } from "./routes";

export interface SettingsNavItem {
  label: string;
  /** Shorter label for the narrow horizontal-scroll tab bar on mobile. */
  shortLabel?: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const SETTINGS_NAV: SettingsNavItem[] = [
  {
    label: "Profile",
    href: ROUTES.settingsProfile,
    icon: User,
    description: "Your name, avatar, and account details",
  },
  {
    label: "Appearance",
    href: ROUTES.settingsAppearance,
    icon: Palette,
    description: "Theme, density, and display preferences",
  },
  {
    label: "Connected AI Models",
    shortLabel: "Models",
    href: ROUTES.settingsModels,
    icon: Cpu,
    description: "Manage which providers are enabled",
  },
  {
    label: "API Keys",
    shortLabel: "Keys",
    href: ROUTES.settingsApiKeys,
    icon: KeyRound,
    description: "Bring your own keys for each provider",
  },
  {
    label: "Chat History",
    shortLabel: "History",
    href: ROUTES.settingsHistory,
    icon: History,
    description: "Export or clear your conversation history",
  },
  {
    label: "Memory",
    href: ROUTES.settingsMemory,
    icon: BrainCircuit,
    description: "What OmniAI remembers about you",
  },
  {
    label: "Notifications",
    shortLabel: "Alerts",
    href: ROUTES.settingsNotifications,
    icon: Bell,
    description: "Email and in-app notification preferences",
  },
  {
    label: "Privacy",
    href: ROUTES.settingsPrivacy,
    icon: ShieldCheck,
    description: "Data controls and privacy settings",
  },
  {
    label: "Subscription",
    shortLabel: "Plan",
    href: ROUTES.settingsSubscription,
    icon: Sparkles,
    description: "Plan, billing, and usage",
  },
];
