"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useUsageStore } from "@/store/useUsageStore";

type ImagePlanKey = "none" | "basic" | "pro" | "ultra_pro";

interface ImagePlanOption {
  key: ImagePlanKey;
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

const IMAGE_PLANS: ImagePlanOption[] = [
  {
    key: "none",
    name: "No Plan",
    price: "$0/mo",
    features: ["No image generation"],
  },
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

const PLAN_ORDER: ImagePlanKey[] = ["none", "basic", "pro", "ultra_pro"];

export function ImagePlanCard() {
  const currentPlan = (useAuthStore((s) => s.user?.imagePlan) ?? "none") as ImagePlanKey;
  const openImageUpgradeModal = useUsageStore((s) => s.openImageUpgradeModal);

  return (
    <div className="grid gap-3 px-4 py-4 sm:grid-cols-4">
      {IMAGE_PLANS.map((plan) => {
        const isCurrent = plan.key === currentPlan;
        const isDowngrade = PLAN_ORDER.indexOf(plan.key) < PLAN_ORDER.indexOf(currentPlan);

        return (
          <div
            key={plan.key}
            className={cn(
              "flex flex-col gap-3 rounded-xl border p-4 transition-all",
              plan.key === "ultra_pro"
                ? "rainbow-border"
                : isCurrent
                ? "current-plan-card border bg-card"
                : "border border-border",
            )}
          >
            <div>
              <p className="text-sm font-semibold text-foreground">{plan.name}</p>
              <p className="text-xs text-muted-foreground">{plan.price}</p>
            </div>
            <ul className="flex flex-1 flex-col gap-1.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Check className="mt-0.5 size-3 shrink-0 text-foreground" />
                  {feature}
                </li>
              ))}
            </ul>
            {isCurrent ? (
              <Button type="button" size="sm" variant="outline" disabled>
                Current plan
              </Button>
            ) : isDowngrade ? (
              <p className="py-1.5 text-center text-xs text-muted-foreground">
                Contact support to downgrade
              </p>
            ) : plan.key === "none" ? null : (
              <Button type="button" size="sm" onClick={openImageUpgradeModal}>
                Subscribe
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
