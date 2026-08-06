"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";
import { settingsService } from "../services/settingsService";
import { useAuthStore } from "@/store/useAuthStore";
import { getApiErrorMessage } from "@/services/httpClient";
import { ROUTES } from "@/constants/routes";

const CONFIRM_WORD = "DELETE";

export function DeleteAccountDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setConfirmText("");
      setError(null);
    }
  }

  async function handleDelete() {
    setError(null);
    setIsDeleting(true);
    try {
      await settingsService.deleteAccount();
      useAuthStore.getState().clearSession();
      router.push(ROUTES.home);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button variant="destructive" size="sm" type="button" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This permanently deletes your account, all conversations, and your data. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label htmlFor="delete-confirm">
            Type <span className="font-semibold text-foreground">{CONFIRM_WORD}</span> to confirm
          </Label>
          <Input
            id="delete-confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoComplete="off"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            variant="destructive"
            disabled={confirmText !== CONFIRM_WORD || isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting…" : "Delete my account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
