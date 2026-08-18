"use client";

import { useState } from "react";
import { ChevronRight, Folder, FolderOpen, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatHistoryItem } from "@/components/molecules/ChatHistoryItem";
import { useFolderStore, type Folder as FolderType } from "@/store/useFolderStore";
import type { Chat } from "@/features/chat/types";

interface FolderItemProps {
  folder: FolderType;
  chats: Chat[];
  onRenameChat: (id: string, title: string) => void;
  onDeleteChat: (id: string) => void;
  onPinChat: (id: string, isPinned: boolean) => void;
  onNavigate?: () => void;
}

export function FolderItem({
  folder,
  chats,
  onRenameChat,
  onDeleteChat,
  onPinChat,
  onNavigate,
}: FolderItemProps) {
  const renameFolder = useFolderStore((s) => s.renameFolder);
  const deleteFolder = useFolderStore((s) => s.deleteFolder);
  const toggleFolderCollapsed = useFolderStore((s) => s.toggleFolderCollapsed);
  const removeChatFromFolder = useFolderStore((s) => s.removeChatFromFolder);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(folder.name);

  function commitRename() {
    setEditing(false);
    const trimmed = name.trim();
    if (trimmed && trimmed !== folder.name) renameFolder(folder.id, trimmed);
    else setName(folder.name);
  }

  return (
    <div className="mb-1">
      {/* Folder header */}
      <div className="group/folder relative flex items-center gap-1 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent">
        <button
          type="button"
          onClick={() => toggleFolderCollapsed(folder.id)}
          className="flex flex-1 items-center gap-1.5 overflow-hidden px-2 py-1.5"
        >
          <ChevronRight
            className={cn(
              "size-3.5 shrink-0 text-sidebar-foreground/50 transition-transform duration-150",
              !folder.collapsed && "rotate-90"
            )}
          />
          {folder.collapsed ? (
            <Folder className="size-3.5 shrink-0 text-sidebar-foreground/60" />
          ) : (
            <FolderOpen className="size-3.5 shrink-0 text-sidebar-foreground/60" />
          )}
          {editing ? (
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") { setName(folder.name); setEditing(false); }
              }}
              onClick={(e) => e.stopPropagation()}
              className="h-6 text-xs"
            />
          ) : (
            <span className="min-w-0 flex-1 truncate text-left font-medium">{folder.name}</span>
          )}
          <span className="ml-auto shrink-0 text-[10px] text-sidebar-foreground/40">
            {chats.length}
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="mr-1 shrink-0 opacity-0 group-hover/folder:opacity-100 data-open:opacity-100"
                aria-label="Folder options"
              >
                <MoreHorizontal className="size-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" side="right">
            <DropdownMenuItem onClick={() => setEditing(true)}>
              <Pencil /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteFolder(folder.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 /> Delete folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Folder contents */}
      <AnimatePresence initial={false}>
        {!folder.collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden pl-4"
          >
            {chats.length === 0 ? (
              <p className="px-2 py-1.5 text-xs text-sidebar-foreground/40">No chats</p>
            ) : (
              <div className="flex flex-col gap-0.5 pt-0.5">
                {chats.map((chat) => (
                  <div key={chat.id} className="group/foldered relative">
                    <ChatHistoryItem
                      chat={chat}
                      onRename={onRenameChat}
                      onDelete={(id) => {
                        removeChatFromFolder(folder.id, id);
                        onDeleteChat(id);
                      }}
                      onPin={onPinChat}
                      onNavigate={onNavigate}
                      extraMenuItems={
                        <DropdownMenuItem onClick={() => removeChatFromFolder(folder.id, chat.id)}>
                          <FolderOpen /> Remove from folder
                        </DropdownMenuItem>
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
