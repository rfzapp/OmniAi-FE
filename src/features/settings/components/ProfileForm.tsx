"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";
import { getUserInitials, useAuthStore, type AuthUser } from "@/store/useAuthStore";
import { ROUTES } from "@/constants/routes";

export function ProfileForm() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          <AvatarFallback className="bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            {getUserInitials(user)}
          </AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" type="button" disabled={!user}>
          Change avatar
        </Button>
      </div>

      {user ? (
        <ProfileFields user={user} />
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link href={ROUTES.login} className="font-medium text-brand-600 hover:underline">
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
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <>
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

      <div>
        <Button type="button" onClick={handleSave} className="w-fit">
          {saved ? "Saved" : "Save changes"}
        </Button>
      </div>
    </>
  );
}
