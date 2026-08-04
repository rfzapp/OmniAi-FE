"use client";

import { Zap } from "lucide-react";
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

export function UpgradeModal() {
  const goToSubscription = useGoToSubscription();
  const open = useUsageStore((s) => s.upgradeModalOpen);
  const closeUpgradeModal = useUsageStore((s) => s.closeUpgradeModal);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeUpgradeModal()}>
      <DialogContent className="max-w-sm text-center sm:max-w-sm">
        <DialogHeader className="items-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
            <Zap className="size-6 fill-current" />
          </div>
          <DialogTitle className="mt-2 text-xl">Unlock Unlimited Intelligence</DialogTitle>
          <DialogDescription className="text-center">
            You have used your free messages. Upgrade to OmniAI Pro to continue chatting.
          </DialogDescription>
        </DialogHeader>
        <Button
          type="button"
          className="mt-2 w-full rounded-full"
          onClick={() => {
            closeUpgradeModal();
            goToSubscription();
          }}
        >
          Upgrade Now
        </Button>
      </DialogContent>
    </Dialog>
  );
}
