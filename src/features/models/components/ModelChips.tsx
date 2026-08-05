"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AI_MODELS } from "@/features/models/data/models";
import { useModelStore } from "@/store/useModelStore";
import { cn } from "@/lib/utils";

export function ModelChips({ className }: { className?: string }) {
  const selectedModelId = useModelStore((s) => s.selectedModelId);
  const setSelectedModelId = useModelStore((s) => s.setSelectedModelId);

  return (
    <div
      className={cn(
        "no-scrollbar flex w-full max-w-full items-center gap-2 overflow-x-auto px-1 py-1",
        className
      )}
    >
      {AI_MODELS.map((model) => {
        const selected = model.id === selectedModelId;
        return (
          <motion.button
            key={model.id}
            type="button"
            onClick={() => setSelectedModelId(model.id)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            aria-pressed={selected}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl border bg-card py-1.5 pr-3.5 pl-1.5 text-sm font-medium shadow-sm transition-colors",
              selected
                ? "border-brand-500 ring-1 ring-brand-500"
                : "border-border hover:border-brand-300"
            )}
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-black/5",
                !model.available && "grayscale"
              )}
            >
              <Image
                src={model.logo}
                alt={`${model.name} logo`}
                width={20}
                height={20}
                className="size-5 object-contain"
              />
            </span>
            <span className={cn("text-foreground", !model.available && "text-muted-foreground")}>
              {model.name}
            </span>
            {!model.available && (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                Soon
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
