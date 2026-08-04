import { Check } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

interface PlanOption {
  name: string;
  price: string;
  features: string[];
  current?: boolean;
  highlighted?: boolean;
}

const PLANS: PlanOption[] = [
  { name: "Free", price: "$0/mo", features: ["Standard models", "Limited daily messages"] },
  {
    name: "Pro",
    price: "$20/mo",
    features: ["All models", "Priority speed", "Unlimited messages"],
    current: true,
    highlighted: true,
  },
  {
    name: "Team",
    price: "$30/mo per seat",
    features: ["Everything in Pro", "Shared workspace", "Admin controls"],
  },
];

export function SubscriptionPlanCard() {
  return (
    <div className="grid gap-3 px-4 py-4 sm:grid-cols-3">
      {PLANS.map((plan) => (
        <div
          key={plan.name}
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
          <Button
            type="button"
            size="sm"
            variant={plan.current ? "outline" : "default"}
            disabled={plan.current}
          >
            {plan.current ? "Current plan" : "Upgrade"}
          </Button>
        </div>
      ))}
    </div>
  );
}
