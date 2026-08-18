"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2, Pin, FolderInput } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { cn } from "@/lib/utils";
import type { Chat } from "@/features/chat/types";
import { ROUTES } from "@/constants/routes";
import { useFolderStore } from "@/store/useFolderStore";

interface ChatHistoryItemProps {
  chat: Chat;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string, isPinned: boolean) => void;
  onNavigate?: () => void;
  extraMenuItems?: ReactNode;
}

export function ChatHistoryItem({ chat, onRename, onDelete, onPin, onNavigate, extraMenuItems }: ChatHistoryItemProps) {
  const pathname = usePathname();
  const active = pathname === ROUTES.chat(chat.id);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);

  const folders = useFolderStore((s) => s.folders);
  const addChatToFolder = useFolderStore((s) => s.addChatToFolder);
  const currentFolder = useFolderStore((s) => s.getFolderForChat(chat.id));

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
    <motion.div
      layout="position"
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
      {chat.isPinned && (
        <Pin className="mr-1.5 size-3 w-3 shrink-0 text-sidebar-foreground/45 group-hover/item:hidden" />
      )}
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
          <DropdownMenuItem onClick={() => onPin(chat.id, !chat.isPinned)}>
            <Pin /> {chat.isPinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditing(true)}>
            <Pencil /> Rename
          </DropdownMenuItem>

          {/* Move to folder */}
          {folders.length > 0 && (
            <>
              <DropdownMenuSeparator />
              {folders
                .filter((f) => f.id !== currentFolder?.id)
                .map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={() => addChatToFolder(folder.id, chat.id)}
                  >
                    <FolderInput /> Move to &ldquo;{folder.name}&rdquo;
                  </DropdownMenuItem>
                ))}
            </>
          )}

          {extraMenuItems && (
            <>
              <DropdownMenuSeparator />
              {extraMenuItems}
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(chat.id)}>
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
