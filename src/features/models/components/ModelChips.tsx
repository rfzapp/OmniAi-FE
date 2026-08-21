"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronDown, Check, Lock } from "lucide-react";
import {
  AI_MODELS,
  GPT_VARIANTS,
  CLAUDE_VARIANTS,
  DEEPSEEK_VARIANTS,
  GROK_VARIANTS,
  QWEN_VARIANTS,
  MISTRAL_VARIANTS,
  KIMI_VARIANTS,
  type ProviderVariant,
} from "@/features/models/data/models";
import { useModelStore } from "@/store/useModelStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUsageStore } from "@/store/useUsageStore";
import { DEFAULT_MODEL_ID } from "@/config/models.config";
import { isModelUnlocked } from "@/config/modelAccess";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import type { StaticImageData } from "next/image";

// ─── types ────────────────────────────────────────────────────────────────────

interface FlatModel {
  id: string;
  name: string;
  description: string;
  speed: "fast" | "standard" | "slower";
  logo: StaticImageData | string;
  providerColor: string;
  parentId: string;
}

interface PanelPos {
  top: number;
  left: number;
  width: number;
  maxHeight?: number;
}

// ─── flat model list ──────────────────────────────────────────────────────────

const ALL_FLAT: FlatModel[] = AI_MODELS.flatMap((model) => {
  if (!model.available) return [];
  const variants: ProviderVariant[] =
    model.id === "gpt-omni"      ? GPT_VARIANTS :
    model.id === "claude-omni"   ? CLAUDE_VARIANTS :
    model.id === "deepseek-omni" ? DEEPSEEK_VARIANTS :
    model.id === "grok-omni"     ? GROK_VARIANTS :
    model.id === "qwen-omni"     ? QWEN_VARIANTS :
    model.id === "mistral-omni"  ? MISTRAL_VARIANTS :
    model.id === "kimi-omni"     ? KIMI_VARIANTS :
    [];
  if (variants.length === 0) return [];
  return variants.map((v) => ({
    id: v.id,
    name: v.name,
    description: v.description,
    speed: v.speed,
    logo: model.logo,
    providerColor: model.color,
    parentId: model.id,
  }));
});

const RECOMMENDED_IDS = ["gpt-5.6-luna", "claude-haiku-4-5", "kimi-k3"];
const PANEL_WIDTH = 300;
const PANEL_GAP = 8;

// ─── model row ───────────────────────────────────────────────────────────────

function ModelRow({
  model,
  isSelected,
  isRecommended,
  locked,
  onSelect,
}: {
  model: FlatModel;
  isSelected: boolean;
  isRecommended?: boolean;
  locked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors",
        locked
          ? "opacity-60 hover:bg-foreground/3 cursor-pointer"
          : isSelected
            ? "bg-foreground/6 ring-1 ring-foreground/10"
            : "hover:bg-foreground/5",
      )}
    >
      {/* Logo */}
      <span className={cn(
        "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/8",
        locked && "grayscale",
      )}>
        <Image src={model.logo} alt={model.name} width={20} height={20} className="size-5 object-contain" />
      </span>

      {/* Name + description */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {locked && <Lock className="size-3 shrink-0 text-muted-foreground/70" />}
          <span className={cn(
            "truncate text-sm font-semibold leading-tight",
            locked ? "text-muted-foreground" : "text-foreground",
          )}>
            {model.name}
          </span>
          {isRecommended && !locked && (
            <span className="shrink-0 rounded-full bg-emerald-50 px-1.5 py-px text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
              ✓
            </span>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground leading-snug">{model.description}</p>
      </div>

      {/* Check or lock indicator */}
      <span className="size-4 shrink-0">
        {locked
          ? null
          : <Check className={cn("size-4 text-foreground transition-opacity", isSelected ? "opacity-100" : "opacity-0")} strokeWidth={2.5} />
        }
      </span>
    </button>
  );
}

// ─── locked model dialog ──────────────────────────────────────────────────────

function LockedModelDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const openUpgradeModal = useUsageStore((s) => s.openUpgradeModal);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="z-99999 max-w-sm text-center">
        <DialogHeader className="items-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
            <Lock className="size-5 text-foreground" />
          </div>
          <DialogTitle className="mt-2">Model Locked</DialogTitle>
          <DialogDescription>
            This model is locked. Upgrade your plan to unlock it.
          </DialogDescription>
        </DialogHeader>
        <Button
          className="mt-2 w-full rounded-full"
          onClick={() => { onClose(); openUpgradeModal(); }}
        >
          Upgrade to Unlock
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export function ModelChips({ className }: { className?: string }) {
  const s = useModelStore();
  const connectedModelIds = useSettingsStore((st) => st.connectedModelIds);
  const subscription = useAuthStore((st) => st.user?.subscription ?? "free");
  const [open, setOpen] = useState(false);
  const [panelPos, setPanelPos] = useState<PanelPos | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [lockedDialogOpen, setLockedDialogOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setHydrated(true); }, []);

  const effectiveId = s.getEffectiveModelId();

  const availableFlat = useMemo(
    () => ALL_FLAT.filter((m) => connectedModelIds.includes(m.parentId)),
    [connectedModelIds],
  );

  const recommendedModels = useMemo(
    () => RECOMMENDED_IDS.map((id) => availableFlat.find((m) => m.id === id)).filter(Boolean) as FlatModel[],
    [availableFlat],
  );

  const otherModels = useMemo(
    () => availableFlat.filter((m) => !RECOMMENDED_IDS.includes(m.id)),
    [availableFlat],
  );

  const currentModel = hydrated
    ? (availableFlat.find((m) => m.id === effectiveId) ?? availableFlat[0])
    : (availableFlat.find((m) => m.id === "gpt-5.6-luna") ?? availableFlat[0]);

  const computePos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const panelW = Math.min(PANEL_WIDTH, vw - 16);

    let left = rect.left;
    if (left + panelW > vw - 8) left = vw - panelW - 8;
    if (left < 8) left = 8;

    const spaceBelow = vh - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const minUsableHeight = 180; // need at least this much to be useful

    if (spaceBelow >= minUsableHeight) {
      // Enough room below — open downward
      setPanelPos({ top: rect.bottom + PANEL_GAP, left, width: panelW });
    } else {
      // Not enough below — open upward, anchor bottom of panel to top of trigger
      const maxH = Math.min(spaceAbove, 480);
      setPanelPos({ top: rect.top - PANEL_GAP - maxH, left, width: panelW, maxHeight: maxH });
    }
  }, []);

  function toggleOpen() {
    if (open) { setOpen(false); return; }
    computePos();
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const handler = () => computePos();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => { window.removeEventListener("scroll", handler, true); window.removeEventListener("resize", handler); };
  }, [open, computePos]);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !panelRef.current?.contains(t)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (!availableFlat.length) return;
    if (!availableFlat.some((m) => m.id === effectiveId)) {
      const fallback = availableFlat.find((m) => m.parentId === DEFAULT_MODEL_ID) ?? availableFlat[0]!;
      selectFlat(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableFlat, effectiveId]);

  function selectFlat(model: FlatModel) {
    // If locked, close dropdown first then show upgrade dialog
    if (!isModelUnlocked(model.id, subscription)) {
      setOpen(false);
      setPanelPos(null);
      // Small delay so the dropdown fully unmounts before dialog mounts
      setTimeout(() => setLockedDialogOpen(true), 50);
      return;
    }
    const p = model.parentId;
    if (p === "gpt-omni")           s.setSelectedGptVariantId(model.id);
    else if (p === "claude-omni")   s.setSelectedClaudeVariantId(model.id);
    else if (p === "deepseek-omni") s.setSelectedDeepSeekVariantId(model.id);
    else if (p === "grok-omni")     s.setSelectedGrokVariantId(model.id);
    else if (p === "qwen-omni")     s.setSelectedQwenVariantId(model.id);
    else if (p === "mistral-omni")  s.setSelectedMistralVariantId(model.id);
    else if (p === "kimi-omni")     s.setSelectedKimiVariantId(model.id);
    setOpen(false);
  }

  if (!currentModel) return null;

  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const maxScrollH = panelPos?.maxHeight
    ?? (panelPos ? Math.min(vh - panelPos.top - 12, 480) : 480);

  return (
    <>
      <div className={cn("relative w-full", className)}>
        {/* Trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={toggleOpen}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm transition-all",
            "hover:border-foreground/20 hover:shadow",
            open && "border-foreground/20 ring-1 ring-foreground/10",
          )}
        >
          <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/8">
            <Image src={currentModel.logo} alt={currentModel.name} width={16} height={16} className="size-4 object-contain" />
          </span>
          <span className="max-w-36 truncate text-foreground sm:max-w-56">{currentModel.name}</span>
          <ChevronDown className={cn("ml-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
        </button>

        {/* Portal panel */}
        {open && panelPos && typeof document !== "undefined" &&
          createPortal(
            <div
              ref={panelRef}
              style={{ position: "fixed", top: panelPos.top, left: panelPos.left, width: panelPos.width, zIndex: 9999 }}
              className="rounded-2xl border border-border bg-popover shadow-2xl ring-1 ring-foreground/5 animate-in fade-in-0 zoom-in-95 duration-150"
            >
              <div className="overflow-y-auto overscroll-contain p-2" style={{ maxHeight: maxScrollH }}>

                {/* Recommended */}
                {recommendedModels.length > 0 && (
                  <div className="mb-1">
                    <p className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                      <span>✦</span> Recommended
                    </p>
                    {recommendedModels.map((m) => {
                      const locked = !isModelUnlocked(m.id, subscription);
                      return (
                        <ModelRow
                          key={m.id}
                          model={m}
                          isSelected={m.id === effectiveId}
                          isRecommended
                          locked={locked}
                          onSelect={() => selectFlat(m)}
                        />
                      );
                    })}
                  </div>
                )}

                {recommendedModels.length > 0 && otherModels.length > 0 && (
                  <div className="mx-2 my-1.5 h-px bg-border/60" />
                )}

                {/* All other models */}
                {otherModels.map((m) => {
                  const locked = !isModelUnlocked(m.id, subscription);
                  return (
                    <ModelRow
                      key={m.id}
                      model={m}
                      isSelected={m.id === effectiveId}
                      locked={locked}
                      onSelect={() => selectFlat(m)}
                    />
                  );
                })}
              </div>
            </div>,
            document.body,
          )
        }
      </div>

      {/* Lock upgrade dialog */}
      <LockedModelDialog open={lockedDialogOpen} onClose={() => setLockedDialogOpen(false)} />
    </>
  );
}
