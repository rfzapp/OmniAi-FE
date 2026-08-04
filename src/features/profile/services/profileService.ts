import { fetchUser } from "@/api/mock/user.mock";
import type { UserProfile } from "../types";

export const profileService = {
  getCurrentUser: (): Promise<UserProfile> => fetchUser(),
};
