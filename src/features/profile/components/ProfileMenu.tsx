"use client";

import Link from "next/link";
import { LogOut, Settings, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";
import { useProfile } from "../hooks/useProfile";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface ProfileMenuProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function ProfileMenu({ collapsed, onNavigate }: ProfileMenuProps) {
  const profile = useProfile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-sidebar-accent",
              collapsed && "justify-center px-0"
            )}
          >
            <Avatar size="sm">
              <AvatarFallback className="bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                {profile?.avatarInitials ?? <UserRound className="size-3.5" />}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <span className="min-w-0 flex-1 truncate text-left">
                <span className="block truncate font-medium text-sidebar-foreground">
                  {profile?.name ?? "Loading…"}
                </span>
                <span className="block truncate text-xs text-sidebar-foreground/50">
                  {profile?.plan ?? ""} plan
                </span>
              </span>
            )}
          </button>
        }
      />
      <DropdownMenuContent align="start" side="top" className="w-56">
        <DropdownMenuLabel>{profile?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link href={ROUTES.settingsProfile} onClick={onNavigate}>
              <Settings /> Settings
            </Link>
          }
        />
        <DropdownMenuItem>
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
