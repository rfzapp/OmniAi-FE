"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useUsageStore } from "@/store/useUsageStore";

interface ImagePlanOption {
  key: "none" | "basic" | "pro";
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
    price: "$20/mo",
    features: ["50 images / month", "1024×1024 resolution", "Standard quality"],
    highlighted: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "$60/mo",
    features: ["Unlimited images", "1024×1024 resolution", "Standard quality", "Priority generation"],
    highlighted: true,
  },
];

const PLAN_ORDER: ImagePlanOption["key"][] = ["none", "basic", "pro"];

export function ImagePlanCard() {
  const currentPlan = (useAuthStore((s) => s.user?.imagePlan) ?? "none") as ImagePlanOption["key"];
  const openImageUpgradeModal = useUsageStore((s) => s.openImageUpgradeModal);

  return (
    <div className="grid gap-3 px-4 py-4 sm:grid-cols-3">
      {IMAGE_PLANS.map((plan) => {
        const isCurrent = plan.key === currentPlan;
        const isDowngrade =
          PLAN_ORDER.indexOf(plan.key) < PLAN_ORDER.indexOf(currentPlan);

        return (
          <div
            key={plan.key}
            className={cn(
              "flex flex-col gap-3 rounded-xl p-4",
              plan.key === "pro"
                ? "relative violet-border-card bg-card"
                : "border border-border",
            )}
          >
            <div>
              <p className="text-sm font-semibold text-foreground">{plan.name}</p>
              <p className="text-xs text-muted-foreground">{plan.price}</p>
            </div>
            <ul className="flex flex-1 flex-col gap-1.5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground"
                >
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
