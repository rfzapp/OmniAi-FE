import type { ReactNode } from "react";
import { SettingsNav } from "@/components/organisms/SettingsNav";

export function SettingsLayoutTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 overflow-y-auto px-4 py-4 md:flex-row md:gap-8 md:px-6 md:py-8">
      <SettingsNav />
      <div className="min-w-0 flex-1 pb-8">{children}</div>
    </div>
  );
}
