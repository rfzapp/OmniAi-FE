import type { ReactNode } from "react";
import { SettingsLayoutTemplate } from "@/components/templates/SettingsLayoutTemplate";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <SettingsLayoutTemplate>{children}</SettingsLayoutTemplate>;
}
