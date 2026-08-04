"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/features/profile/hooks/useProfile";

export function ProfileForm() {
  const profile = useProfile();
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setName(profile.name);
  }, [profile]);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          <AvatarFallback className="bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            {profile?.avatarInitials ?? "…"}
          </AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" type="button">
          Change avatar
        </Button>
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
        <Input id="profile-email" value={profile?.email ?? ""} disabled className="max-w-sm" />
      </div>

      <div>
        <Button type="button" onClick={handleSave} className="w-fit">
          {saved ? "Saved" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
