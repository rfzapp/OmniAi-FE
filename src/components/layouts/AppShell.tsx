import type { ReactNode } from "react";
import { Sidebar } from "@/components/organisms/Sidebar";
import { MobileSidebarSheet } from "@/components/organisms/MobileSidebarSheet";
import { MobileTopBar } from "@/components/organisms/MobileTopBar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <Sidebar />
      <MobileSidebarSheet />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
