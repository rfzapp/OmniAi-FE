"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AI_MODELS } from "@/features/models/data/models";
import { ModelListItem } from "@/features/models/components/ModelListItem";
import { useModelStore } from "@/store/useModelStore";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";

export function ModelSelectorDropdown() {
  const selectedModelId = useModelStore((s) => s.selectedModelId);
  const setSelectedModelId = useModelStore((s) => s.setSelectedModelId);
  const selectedModel = AI_MODELS.find((m) => m.id === selectedModelId) ?? AI_MODELS[0];

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false));

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-full border border-border px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        )}
      >
        <span className="flex size-4 items-center justify-center rounded-full bg-brand-100 text-[10px] font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
          {selectedModel.glyph}
        </span>
        <span className="hidden sm:inline">{selectedModel.name}</span>
        <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="menu"
            className="absolute bottom-full left-0 z-50 mb-2 max-h-96 w-80 max-w-[90vw] overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10"
          >
            <p className="px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
              Choose a model
            </p>
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setSelectedModelId(model.id);
                  setOpen(false);
                }}
                className="flex w-full rounded-md px-1.5 py-1 text-left outline-none hover:bg-accent focus-visible:bg-accent"
              >
                <ModelListItem model={model} selected={model.id === selectedModelId} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
