"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";
import { settingsService } from "../services/settingsService";
import { getApiErrorMessage } from "@/services/httpClient";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSaved(false);
    setIsSaving(true);
    try {
      await settingsService.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-4">
      <div className="grid gap-1.5">
        <Label htmlFor="current-password">Current password</Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="max-w-sm"
          autoComplete="current-password"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="max-w-sm"
          autoComplete="new-password"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="confirm-password">Confirm new password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="max-w-sm"
          autoComplete="new-password"
        />
        {confirmPassword.length > 0 && newPassword !== confirmPassword && (
          <p className="text-xs text-destructive">Passwords don&apos;t match</p>
        )}
      </div>

      {error && (
        <p role="alert" className="max-w-sm rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div>
        <Button type="submit" disabled={isSaving || !canSubmit} className="w-fit">
          {isSaving ? "Updating…" : saved ? "Password updated" : "Update password"}
        </Button>
      </div>
    </form>
  );
}
