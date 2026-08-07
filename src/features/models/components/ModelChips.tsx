"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { AI_MODELS, GPT_VARIANTS } from "@/features/models/data/models";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useModelStore } from "@/store/useModelStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { DEFAULT_MODEL_ID } from "@/config/models.config";
import { cn } from "@/lib/utils";

export function ModelChips({ className }: { className?: string }) {
  const selectedModelId = useModelStore((s) => s.selectedModelId);
  const selectedGptVariantId = useModelStore((s) => s.selectedGptVariantId);
  const setSelectedModelId = useModelStore((s) => s.setSelectedModelId);
  const setSelectedGptVariantId = useModelStore((s) => s.setSelectedGptVariantId);
  const connectedModelIds = useSettingsStore((s) => s.connectedModelIds);

  const visibleModels = useMemo(
    () => AI_MODELS.filter((m) => connectedModelIds.includes(m.id)),
    [connectedModelIds],
  );

  const activeGptVariant = useMemo(
    () => GPT_VARIANTS.find((v) => v.id === selectedGptVariantId) ?? GPT_VARIANTS[0]!,
    [selectedGptVariantId],
  );

  useEffect(() => {
    if (visibleModels.length === 0) return;
    if (!visibleModels.some((m) => m.id === selectedModelId)) {
      const fallback = visibleModels.find((m) => m.id === DEFAULT_MODEL_ID) ?? visibleModels[0]!;
      setSelectedModelId(fallback.id);
    }
  }, [visibleModels, selectedModelId, setSelectedModelId]);

  return (
    <div
      className={cn(
        "no-scrollbar flex w-full max-w-full items-center gap-2 overflow-x-auto px-1 py-1",
        className
      )}
    >
      {visibleModels.map((model) => {
        const isGpt = model.id === "gpt-omni";
        const selected = isGpt ? selectedModelId === "gpt-omni" : model.id === selectedModelId;

        if (isGpt) {
          return (
            <DropdownMenu key={model.id}>
              <DropdownMenuTrigger
                onClick={() => setSelectedModelId("gpt-omni")}
                suppressHydrationWarning
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl border bg-card py-1.5 pr-3 pl-1.5 text-sm font-medium shadow-sm transition-all cursor-pointer outline-none",
                  selected
                    ? "border-[#0d0d0d] ring-1 ring-[#0d0d0d] bg-muted/40 text-foreground"
                    : "border-border hover:border-foreground/30"
                )}
              >
                <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-black/5">
                  <Image
                    src={model.logo}
                    alt={`${model.name} logo`}
                    width={20}
                    height={20}
                    className="size-5 object-contain"
                  />
                </span>
                <span className="flex items-center gap-1">
                  <span>{activeGptVariant.name}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                side="bottom"
                sideOffset={8}
                className="z-50 w-[calc(100vw-2rem)] max-w-72 rounded-2xl border border-border bg-popover p-2 shadow-xl ring-1 ring-black/5"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2.5 py-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Select ChatGPT Model
                  </DropdownMenuLabel>
                  <div className="mt-1 space-y-1">
                    {GPT_VARIANTS.map((variant) => {
                      const isVariantSelected = selectedGptVariantId === variant.id;
                      return (
                        <DropdownMenuItem
                          key={variant.id}
                          onClick={() => {
                            setSelectedModelId("gpt-omni");
                            setSelectedGptVariantId(variant.id);
                          }}
                          className={cn(
                            "flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left cursor-pointer transition-colors outline-none",
                            isVariantSelected
                              ? "bg-muted text-foreground font-medium"
                              : "hover:bg-muted/80 text-foreground"
                          )}
                        >
                          <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
                            {isVariantSelected ? (
                              <Check className="size-4 text-foreground" />
                            ) : (
                              <div className="size-1.5 rounded-full bg-muted-foreground/30" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold text-sm leading-snug">
                                {variant.name}
                              </span>
                              {variant.badge && (
                                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground/70">
                                  {variant.badge}
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed whitespace-normal">
                              {variant.description}
                            </p>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <motion.button
            key={model.id}
            type="button"
            onClick={() => setSelectedModelId(model.id)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            aria-pressed={selected}
            suppressHydrationWarning
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl border bg-card py-1.5 pr-3.5 pl-1.5 text-sm font-medium shadow-sm transition-colors",
              selected
                ? "border-[#0d0d0d] ring-1 ring-[#0d0d0d]"
                : "border-border hover:border-foreground/30"
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
