"use client";

import { ImageIcon, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/atoms/Button";
import { useUsageStore } from "@/store/useUsageStore";
import { useGoToSubscription } from "@/features/settings/hooks/useGoToSubscription";
import { cn } from "@/lib/utils";

interface ImagePlanOption {
  key: "basic" | "pro" | "ultra_pro";
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

const IMAGE_PLANS: ImagePlanOption[] = [
  {
    key: "basic",
    name: "Basic",
    price: "$50/mo",
    features: ["3 images / day", "All AI models", "1024×1024 resolution"],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$150/mo",
    features: ["10 images / day", "All AI models", "1024×1024 resolution", "Priority generation"],
    highlighted: true,
  },
  {
    key: "ultra_pro",
    name: "Ultra Pro",
    price: "$250/mo",
    features: ["15 images / day", "All AI models", "1024×1024 resolution", "Priority generation", "Highest quality"],
  },
];

export function ImageUpgradeModal() {
  const goToSubscription = useGoToSubscription();
  const open = useUsageStore((s) => s.imageUpgradeModalOpen);
  const closeImageUpgradeModal = useUsageStore((s) => s.closeImageUpgradeModal);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeImageUpgradeModal()}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-foreground">
            <ImageIcon className="size-6" />
          </div>
          <DialogTitle className="mt-2 text-xl">Unlock Image Generation</DialogTitle>
          <DialogDescription className="text-center">
            Separate add-on — works with GPT, Claude, and all other models.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid grid-cols-3 gap-3">
          {IMAGE_PLANS.map((plan) => (
            <div
              key={plan.key}
              className={cn(
                "relative flex flex-col gap-3 rounded-xl border p-4",
                plan.key === "ultra_pro"
                  ? "rainbow-border"
                  : plan.highlighted
                  ? "border-[#0d0d0d] bg-[#0d0d0d]/5"
                  : "border-border bg-card",
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[#0d0d0d] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  Most popular
                </span>
              )}
              <div>
                <p className="font-semibold text-foreground">{plan.name}</p>
                <p className="text-lg font-bold text-foreground">{plan.price}</p>
              </div>
              <ul className="flex flex-col gap-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="size-3 shrink-0 text-foreground" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                size="sm"
                variant={plan.highlighted ? "default" : "outline"}
                className="mt-auto w-full rounded-full"
                onClick={() => {
                  closeImageUpgradeModal();
                  goToSubscription();
                }}
              >
                Get {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
