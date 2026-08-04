"use client";

import { motion } from "framer-motion";
import { useSidebarStore } from "@/store/useSidebarStore";
import { SidebarContent } from "@/features/sidebar/components/SidebarContent";

export function Sidebar() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed);

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 212 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="hidden shrink-0 border-r border-sidebar-border md:block"
    >
      <div className="sticky top-0 h-dvh">
        <SidebarContent collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      </div>
    </motion.aside>
  );
}
