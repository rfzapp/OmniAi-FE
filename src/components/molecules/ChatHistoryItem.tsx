"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { cn } from "@/lib/utils";
import type { Chat } from "@/features/chat/types";
import { ROUTES } from "@/constants/routes";

interface ChatHistoryItemProps {
  chat: Chat;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onNavigate?: () => void;
}

export function ChatHistoryItem({ chat, onRename, onDelete, onNavigate }: ChatHistoryItemProps) {
  const pathname = usePathname();
  const active = pathname === ROUTES.chat(chat.id);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);

  function commitRename() {
    setEditing(false);
    const trimmed = title.trim();
    if (trimmed && trimmed !== chat.title) onRename(chat.id, trimmed);
    else setTitle(chat.title);
  }

  if (editing) {
    return (
      <Input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={commitRename}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitRename();
          if (e.key === "Escape") {
            setTitle(chat.title);
            setEditing(false);
          }
        }}
        className="h-7 text-sm"
      />
    );
  }

  return (
    <div
      className={cn(
        "group/item relative flex items-center rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent",
        active && "bg-sidebar-accent text-sidebar-accent-foreground"
      )}
    >
      <Link
        href={ROUTES.chat(chat.id)}
        onClick={onNavigate}
        className="min-w-0 flex-1 truncate px-2.5 py-1.5"
      >
        {chat.title}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="mr-1 shrink-0 opacity-0 group-hover/item:opacity-100 data-open:opacity-100"
              aria-label="Chat options"
            >
              <MoreHorizontal className="size-3.5" />
            </Button>
          }
        />
        <DropdownMenuContent align="start" side="right">
          <DropdownMenuItem onClick={() => setEditing(true)}>
            <Pencil /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(chat.id)}>
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
