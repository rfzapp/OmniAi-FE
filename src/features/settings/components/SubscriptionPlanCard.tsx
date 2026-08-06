"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useUsageStore } from "@/store/useUsageStore";

interface PlanOption {
  key: "free" | "pro" | "enterprise";
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

const PLANS: PlanOption[] = [
  { key: "free", name: "Free", price: "$0/mo", features: ["Standard models", "3 messages total"] },
  {
    key: "pro",
    name: "Pro",
    price: "$20/mo",
    features: ["All models", "Priority speed", "Unlimited messages"],
    highlighted: true,
  },
  {
    key: "enterprise",
    name: "Team",
    price: "$30/mo per seat",
    features: ["Everything in Pro", "Shared workspace", "Admin controls"],
  },
];

const PLAN_ORDER: PlanOption["key"][] = ["free", "pro", "enterprise"];

export function SubscriptionPlanCard() {
  const currentPlan = useAuthStore((s) => s.user?.subscription) as PlanOption["key"] | undefined;
  const openUpgradeModal = useUsageStore((s) => s.openUpgradeModal);

  return (
    <div className="grid gap-3 px-4 py-4 sm:grid-cols-3">
      {PLANS.map((plan) => {
        const isCurrent = plan.key === currentPlan;
        const isDowngrade = currentPlan ? PLAN_ORDER.indexOf(plan.key) < PLAN_ORDER.indexOf(currentPlan) : false;

        return (
          <div
            key={plan.key}
            className={cn(
              "flex flex-col gap-3 rounded-xl border p-4",
              plan.highlighted ? "border-brand-400 bg-brand-50/50 dark:bg-brand-950/20" : "border-border"
            )}
          >
            <div>
              <p className="text-sm font-semibold text-foreground">{plan.name}</p>
              <p className="text-xs text-muted-foreground">{plan.price}</p>
            </div>
            <ul className="flex flex-1 flex-col gap-1.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Check className="mt-0.5 size-3 shrink-0 text-brand-600" />
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
