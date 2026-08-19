"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import {
  AI_MODELS, GPT_VARIANTS, CLAUDE_VARIANTS, DEEPSEEK_VARIANTS,
  GROK_VARIANTS, QWEN_VARIANTS, MISTRAL_VARIANTS, KIMI_VARIANTS,
  type ProviderVariant,
} from "@/features/models/data/models";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useModelStore } from "@/store/useModelStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { DEFAULT_MODEL_ID } from "@/config/models.config";
import { cn } from "@/lib/utils";
import type { StaticImageData } from "next/image";

interface VariantDropdownProps {
  logo: StaticImageData | string;
  modelName: string;
  label: string;
  variants: ProviderVariant[];
  selectedVariantId: string;
  selected: boolean;
  onSelectModel: () => void;
  onSelectVariant: (id: string) => void;
}

function VariantDropdown({ logo, modelName, label, variants, selectedVariantId, selected, onSelectModel, onSelectVariant }: VariantDropdownProps) {
  const activeVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0]!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={onSelectModel}
        suppressHydrationWarning
        className={cn(
          "flex shrink-0 items-center gap-2 rounded-xl border bg-card py-1.5 pr-3 pl-1.5 text-sm font-medium shadow-sm transition-all cursor-pointer outline-none",
          selected ? "border-[#0d0d0d] ring-1 ring-[#0d0d0d] bg-muted/40" : "border-border hover:border-foreground/30"
        )}
      >
        <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-black/5">
          <Image src={logo} alt={`${modelName} logo`} width={20} height={20} className="size-5 object-contain" />
        </span>
        <span className="flex items-center gap-1">
          <span>{activeVariant.name}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" sideOffset={8}
        className="z-50 w-[calc(100vw-2rem)] max-w-72 rounded-2xl border border-border bg-popover p-2 shadow-xl ring-1 ring-black/5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5 py-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            {label}
          </DropdownMenuLabel>
          <div className="mt-1 space-y-1">
            {variants.map((variant) => {
              const isSelected = selectedVariantId === variant.id;
              return (
                <DropdownMenuItem key={variant.id} onClick={() => onSelectVariant(variant.id)}
                  className={cn("flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left cursor-pointer outline-none",
                    isSelected ? "bg-muted font-medium" : "hover:bg-muted/80")}>
                  <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
                    {isSelected ? <Check className="size-4 text-foreground" /> : <div className="size-1.5 rounded-full bg-muted-foreground/30" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-sm">{variant.name}</span>
                      {variant.badge && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground/70">{variant.badge}</span>}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground whitespace-normal">{variant.description}</p>
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

const VARIANT_CONFIG: Record<string, { label: string; variants: ProviderVariant[] }> = {
  "gpt-omni":      { label: "Select ChatGPT Model",  variants: GPT_VARIANTS },
  "claude-omni":   { label: "Select Claude Model",   variants: CLAUDE_VARIANTS },
  "deepseek-omni": { label: "Select DeepSeek Model", variants: DEEPSEEK_VARIANTS },
  "grok-omni":     { label: "Select Grok Model",     variants: GROK_VARIANTS },
  "qwen-omni":     { label: "Select Qwen Model",     variants: QWEN_VARIANTS },
  "mistral-omni":  { label: "Select Mistral Model",  variants: MISTRAL_VARIANTS },
  "kimi-omni":     { label: "Select Kimi Model",     variants: KIMI_VARIANTS },
};

export function ModelChips({ className }: { className?: string }) {
  const s = useModelStore();
  const connectedModelIds = useSettingsStore((st) => st.connectedModelIds);

  const visibleModels = useMemo(
    () => AI_MODELS.filter((m) => connectedModelIds.includes(m.id)),
    [connectedModelIds],
  );

  useEffect(() => {
    if (!visibleModels.length) return;
    if (!visibleModels.some((m) => m.id === s.selectedModelId)) {
      const fallback = visibleModels.find((m) => m.id === DEFAULT_MODEL_ID) ?? visibleModels[0]!;
      s.setSelectedModelId(fallback.id);
    }
  }, [visibleModels, s.selectedModelId]);

  function getSelectedVariantId(modelId: string): string {
    if (modelId === "gpt-omni") return s.selectedGptVariantId;
    if (modelId === "claude-omni") return s.selectedClaudeVariantId;
    if (modelId === "deepseek-omni") return s.selectedDeepSeekVariantId;
    if (modelId === "grok-omni") return s.selectedGrokVariantId;
    if (modelId === "qwen-omni") return s.selectedQwenVariantId;
    if (modelId === "mistral-omni") return s.selectedMistralVariantId;
    if (modelId === "kimi-omni") return s.selectedKimiVariantId;
    return modelId;
  }

  function setVariantId(modelId: string, variantId: string) {
    if (modelId === "gpt-omni") s.setSelectedGptVariantId(variantId);
    else if (modelId === "claude-omni") s.setSelectedClaudeVariantId(variantId);
    else if (modelId === "deepseek-omni") s.setSelectedDeepSeekVariantId(variantId);
    else if (modelId === "grok-omni") s.setSelectedGrokVariantId(variantId);
    else if (modelId === "qwen-omni") s.setSelectedQwenVariantId(variantId);
    else if (modelId === "mistral-omni") s.setSelectedMistralVariantId(variantId);
    else if (modelId === "kimi-omni") s.setSelectedKimiVariantId(variantId);
  }

  return (
    <div className={cn("no-scrollbar flex w-full max-w-full items-center gap-2 overflow-x-auto px-1 py-1", className)}>
      {visibleModels.map((model) => {
        const selected = model.id === s.selectedModelId;
        const config = VARIANT_CONFIG[model.id];

        if (config) {
          return (
            <VariantDropdown
              key={model.id}
              logo={model.logo}
              modelName={model.name}
              label={config.label}
              variants={config.variants}
              selectedVariantId={getSelectedVariantId(model.id)}
              selected={selected}
              onSelectModel={() => s.setSelectedModelId(model.id)}
              onSelectVariant={(id) => setVariantId(model.id, id)}
            />
          );
        }

        return (
          <motion.button key={model.id} type="button" onClick={() => s.setSelectedModelId(model.id)}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }} aria-pressed={selected} suppressHydrationWarning
            className={cn("flex shrink-0 items-center gap-2 rounded-xl border bg-card py-1.5 pr-3.5 pl-1.5 text-sm font-medium shadow-sm transition-colors",
              selected ? "border-[#0d0d0d] ring-1 ring-[#0d0d0d]" : "border-border hover:border-foreground/30")}>
            <span className={cn("flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-black/5", !model.available && "grayscale")}>
              <Image src={model.logo} alt={`${model.name} logo`} width={20} height={20} className="size-5 object-contain" />
            </span>
            <span className={cn(!model.available && "text-muted-foreground")}>{model.name}</span>
            {!model.available && <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Soon</span>}
          </motion.button>
        );
      })}
    </div>
  );
}
