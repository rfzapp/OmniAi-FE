"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, PenSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo, LogoMark } from "@/components/atoms/Logo";
import { IconButton } from "@/components/atoms/IconButton";
import { Button } from "@/components/atoms/Button";
import { SearchInput } from "@/components/molecules/SearchInput";
import { ChatHistoryItem } from "@/components/molecules/ChatHistoryItem";
import { SidebarSubscriptionPromo } from "./SidebarSubscriptionPromo";
import { useChatHistory } from "@/features/sidebar/hooks/useChatHistory";
import { useChat } from "@/features/chat/hooks/useChat";
import { useDebounce } from "@/hooks/useDebounce";
import { ROUTES } from "@/constants/routes";

const GROUP_LABELS: Record<string, string> = {
  Today: "Today",
  Yesterday: "Yesterday",
  "Previous 7 Days": "Previous 7 Days",
  Older: "Older Chats",
};

interface SidebarContentProps {
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
}

export function SidebarContent({
  collapsed = false,
  onToggleCollapsed,
  onNavigate,
}: SidebarContentProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 200);
  const sections = useChatHistory(debouncedQuery);
  const { deleteChat, renameChat } = useChat();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2 px-3 pt-3">
        {collapsed ? (
          <LogoMark size={26} className="mx-auto" />
        ) : (
          <Logo size={24} />
        )}
        {onToggleCollapsed && (
          <IconButton
            label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggleCollapsed}
            className={collapsed ? "hidden" : ""}
          >
            <PanelLeftClose className="size-4" />
          </IconButton>
        )}
      </div>

      {collapsed && onToggleCollapsed && (
        <div className="flex justify-center pt-2">
          <IconButton label="Expand sidebar" onClick={onToggleCollapsed}>
            <PanelLeftOpen className="size-4" />
          </IconButton>
        </div>
      )}

      <div className="flex flex-col gap-1 px-3 pt-3">
        <Button
          variant="outline"
          onClick={() => {
            router.push(ROUTES.home);
            onNavigate?.();
          }}
          className={collapsed ? "justify-center px-0" : "justify-start gap-2"}
        >
          <PenSquare className="size-4" />
          {!collapsed && "New Chat"}
        </Button>
      </div>

      {!collapsed && (
        <div className="px-3 pt-2">
          <SearchInput value={query} onChange={setQuery} />
        </div>
      )}

      <div className="no-scrollbar mt-2 flex-1 overflow-y-auto px-3 pb-2">
        {!collapsed && (
          <AnimatePresence initial={false}>
            {sections.map((section) => (
              <motion.div
                key={section.group}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-3"
              >
                <p className="px-2.5 py-1 text-xs font-medium text-sidebar-foreground/50">
                  {GROUP_LABELS[section.group] ?? section.group}
                </p>
                <div className="flex flex-col gap-0.5">
                  {section.chats.map((chat) => (
                    <ChatHistoryItem
                      key={chat.id}
                      chat={chat}
                      onRename={renameChat}
                      onDelete={deleteChat}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
            {sections.length === 0 && (
              <p className="px-2.5 py-4 text-center text-xs text-sidebar-foreground/50">
                No chats found
              </p>
            )}
          </AnimatePresence>
        )}
      </div>

      {!collapsed && <SidebarSubscriptionPromo />}
    </div>
  );
}
