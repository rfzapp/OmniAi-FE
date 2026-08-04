"use client";

import { useEffect, useState } from "react";
import { profileService } from "../services/profileService";
import type { UserProfile } from "../types";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let active = true;
    void profileService.getCurrentUser().then((user) => {
      if (active) setProfile(user);
    });
    return () => {
      active = false;
    };
  }, []);

  return profile;
}
