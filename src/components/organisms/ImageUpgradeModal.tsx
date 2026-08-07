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
  key: "basic" | "pro";
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

const IMAGE_PLANS: ImagePlanOption[] = [
  {
    key: "basic",
    name: "Basic",
    price: "$20/mo",
    features: ["50 images / month", "1024×1024 resolution", "Standard quality"],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$60/mo",
    features: ["Unlimited images", "1024×1024 resolution", "Standard quality", "Priority generation"],
    highlighted: true,
  },
];

export function ImageUpgradeModal() {
  const goToSubscription = useGoToSubscription();
  const open = useUsageStore((s) => s.imageUpgradeModalOpen);
  const closeImageUpgradeModal = useUsageStore((s) => s.closeImageUpgradeModal);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeImageUpgradeModal()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-foreground">
            <ImageIcon className="size-6" />
          </div>
          <DialogTitle className="mt-2 text-xl">Unlock Image Generation</DialogTitle>
          <DialogDescription className="text-center">
            Image generation is a separate add-on — available even on the free chat plan.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid grid-cols-2 gap-3">
          {IMAGE_PLANS.map((plan) => (
            <div
              key={plan.key}
              className={cn(
                "relative flex flex-col gap-3 rounded-xl border p-4",
                plan.highlighted
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
