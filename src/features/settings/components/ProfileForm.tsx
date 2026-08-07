"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";
import { getUserInitials, useAuthStore, type AuthUser } from "@/store/useAuthStore";
import { settingsService } from "../services/settingsService";
import { getApiErrorMessage } from "@/services/httpClient";
import { ROUTES } from "@/constants/routes";

export function ProfileForm() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {user ? (
        <ProfileFields user={user} />
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link href={ROUTES.login} className="font-medium text-foreground underline hover:text-foreground/70">
            Log in
          </Link>{" "}
          to edit your profile.
        </p>
      )}
    </div>
  );
}

function ProfileFields({ user }: { user: AuthUser }) {
  const [name, setName] = useState(user.fullName);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedName = name.trim();
  const trimmedAvatar = avatarUrl.trim();
  const isDirty = trimmedName !== user.fullName || trimmedAvatar !== user.avatar;

  async function handleSave() {
    setError(null);
    setSaved(false);
    setIsSaving(true);
    try {
      await settingsService.updateProfile({
        ...(trimmedName !== user.fullName && { fullName: trimmedName }),
        ...(trimmedAvatar !== user.avatar && { avatar: trimmedAvatar }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          <AvatarImage src={avatarUrl || undefined} alt={user.fullName} />
          <AvatarFallback className="bg-muted text-foreground">
            {getUserInitials(user)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 grid gap-1.5">
          <Label htmlFor="profile-avatar">Avatar URL</Label>
          <Input
            id="profile-avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.png"
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="profile-name">Display name</Label>
        <Input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="profile-email">Email</Label>
        <Input id="profile-email" value={user.email} disabled className="max-w-sm" />
      </div>

      {error && (
        <p role="alert" className="max-w-sm rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div>
        <Button type="button" onClick={handleSave} disabled={isSaving || !isDirty} className="w-fit">
          {isSaving ? "Saving…" : saved ? "Saved" : "Save changes"}
        </Button>
      </div>
    </>
  );
}
