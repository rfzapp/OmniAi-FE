"use client";

import Link from "next/link";
import { Menu, Star, Bell } from "lucide-react";
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
  const subscription = useAuthStore((s) => s.user?.subscription ?? "free");

  const planLabel =
    subscription === "ultra_pro" ? `Ultra Pro — ${remaining} left this month`
    : subscription === "pro" ? `Pro — ${remaining} left this month`
    : subscription === "standard" ? `Standard — ${remaining} left this month`
    : null;

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 bg-transparent px-3 backdrop-blur-sm sm:px-5">
      {/* Mobile: hamburger + logo */}
      <div className="flex items-center gap-2 md:hidden">
        <IconButton label="Open menu" showTooltip={false} onClick={() => setMobileOpen(true)}>
          <Menu className="size-4" />
        </IconButton>
        <Logo size={18} />
      </div>
      <div className="hidden md:block" />

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Prompts remaining pill — paid plans */}
        {isUnlimited && planLabel && (
          <span
            suppressHydrationWarning
            className="hidden select-none items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground sm:flex"
          >
            {planLabel}
          </span>
        )}

        {/* Upgrade Plan button */}
        {!isUnlimited ? (
          <Button
            type="button"
            size="sm"
            onClick={openUpgradeModal}
            className="hidden items-center gap-1.5 rounded-lg px-3.5 shadow-sm sm:flex"
          >
            <Star className="size-3.5 fill-current" />
            Upgrade Plan
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={openUpgradeModal}
            className="hidden items-center gap-1.5 rounded-lg px-3.5 sm:flex"
          >
            <Star className="size-3.5 fill-current" />
            Upgrade Plan
          </Button>
        )}

        {/* Bell icon */}
        <Link
          href={ROUTES.settings}
          aria-label="Notifications"
          className="relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="size-4" />
          {/* Notification dot */}
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
        </Link>

        {/* Avatar / profile */}
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
