"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";
import { getUserInitials, useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/features/auth/services/authService";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface ProfileMenuProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function ProfileMenu({ collapsed, onNavigate }: ProfileMenuProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setOpen(false));

  async function handleLogout() {
    setOpen(false);
    onNavigate?.();
    await authService.logout();
    router.push(ROUTES.home);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-sidebar-accent",
          collapsed && "justify-center px-0"
        )}
      >
        <Avatar size="sm">
          <AvatarFallback className="bg-muted text-foreground">
            {getUserInitials(user)}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <span className="min-w-0 flex-1 truncate text-left">
            <span className="block truncate font-medium text-sidebar-foreground">
              {user?.fullName ?? "Account"}
            </span>
            <span className="block truncate text-xs text-sidebar-foreground/50">
              {user?.email ?? ""}
            </span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="menu"
            className="absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10"
          >
            <p className="truncate px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
              {user?.email}
            </p>
            <div className="my-1 h-px bg-border" />
            <Link
              href={ROUTES.settingsProfile}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm hover:bg-accent"
            >
              <Settings className="size-4" /> Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4" /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
