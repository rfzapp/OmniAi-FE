"use client";

import { useRouter } from "next/navigation";
import { Menu, PenSquare } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { Logo } from "@/components/atoms/Logo";
import { useSidebarStore } from "@/store/useSidebarStore";
import { ROUTES } from "@/constants/routes";

export function MobileTopBar() {
  const router = useRouter();
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);

  return (
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background/95 px-2 backdrop-blur-sm md:hidden">
      <IconButton label="Open menu" showTooltip={false} onClick={() => setMobileOpen(true)}>
        <Menu className="size-4" />
      </IconButton>
      <Logo size={20} />
      <IconButton
        label="New chat"
        showTooltip={false}
        onClick={() => router.push(ROUTES.home)}
      >
        <PenSquare className="size-4" />
      </IconButton>
    </header>
  );
}
