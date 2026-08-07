"use client";

import Link from "next/link";
import { Menu, Settings, Zap } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";
import { ProfileMenu } from "@/features/profile/components/ProfileMenu";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useUsageStore, useRemainingFreePrompts, useIsUnlimitedPlan } from "@/store/useUsageStore";
import { useAuthStore } from "@/store/useAuthStore";
import { FREE_PROMPT_LIMIT } from "@/config/usage.config";
import { ROUTES } from "@/constants/routes";

export function TopBar() {
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const remaining = useRemainingFreePrompts();
  const isUnlimited = useIsUnlimitedPlan();
  const openUpgradeModal = useUsageStore((s) => s.openUpgradeModal);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 bg-transparent px-3 backdrop-blur-sm sm:px-5">
      <div className="flex items-center gap-2 md:hidden">
        <IconButton label="Open menu" showTooltip={false} onClick={() => setMobileOpen(true)}>
          <Menu className="size-4" />
        </IconButton>
        <Logo size={18} />
      </div>
      <div className="hidden md:block" />

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {isUnlimited ? (
          <span className="hidden items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground sm:flex">
            <Zap className="size-3.5 text-foreground" />
            Pro — Unlimited
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={openUpgradeModal}
              className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground sm:flex"
            >
              <Zap className="size-3.5 text-foreground/60" />
              {remaining} / {FREE_PROMPT_LIMIT} Free Prompts
            </button>
            <Button
              type="button"
              size="sm"
              onClick={openUpgradeModal}
              className="rounded-full px-3.5 shadow-sm"
            >
              Upgrade
            </Button>
          </>
        )}
        <Link
          href={ROUTES.settings}
          aria-label="Settings"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Settings className="size-4" />
        </Link>

        {isAuthenticated ? (
          <ProfileMenu collapsed />
        ) : (
          <Link
            href={ROUTES.login}
            className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted"
          >
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}
