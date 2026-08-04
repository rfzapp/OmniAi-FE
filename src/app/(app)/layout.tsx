import type { ReactNode } from "react";
import { AppShell } from "@/components/layouts/AppShell";

export default function AppRouteGroupLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
