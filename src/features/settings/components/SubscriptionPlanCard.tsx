"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useUsageStore } from "@/store/useUsageStore";

interface PlanOption {
  key: "free" | "standard" | "pro" | "ultra_pro";
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

const PLANS: PlanOption[] = [
  { key: "free", name: "Free", price: "$0/mo", features: ["Standard models", "3 messages total", "No file attachments"] },
  {
    key: "standard",
    name: "Standard",
    price: "$25/mo",
    features: ["All models", "100 prompts daily", "Limit to 3 file attachments daily"],
    highlighted: true,
  },
  {
    key: "pro",
    name: "Pro",
    price: "$100/mo",
    features: ["Everything in Standard", "500 prompts daily", "Limit to 15 file attachments daily"],
  },
  {
    key: "ultra_pro",
    name: "Ultra Pro",
    price: "$200/mo",
    features: ["Everything in Pro", "1500 prompts daily", "Limit to 45 file attachments daily"],
  },
];

const PLAN_ORDER: PlanOption["key"][] = ["free", "standard", "pro", "ultra_pro"];

export function SubscriptionPlanCard() {
  const currentPlan = useAuthStore((s) => s.user?.subscription) as PlanOption["key"] | undefined;
  const openUpgradeModal = useUsageStore((s) => s.openUpgradeModal);

  return (
    <div className="grid gap-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
      {PLANS.map((plan) => {
        const isCurrent = plan.key === currentPlan;
        const isDowngrade = currentPlan ? PLAN_ORDER.indexOf(plan.key) < PLAN_ORDER.indexOf(currentPlan) : false;

        return (
          <div
            key={plan.key}
            className={cn(
              "flex flex-col gap-3 rounded-xl border p-4 transition-all",
              plan.key === "ultra_pro"
                ? "rainbow-border-card bg-card"
                : isCurrent
                ? "current-plan-card border bg-card"
                : "border border-border"
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
              <p className="py-1.5 text-center text-xs text-muted-foreground">Contact support to change plans</p>
            ) : (
              <Button type="button" size="sm" onClick={openUpgradeModal}>
                Upgrade
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
