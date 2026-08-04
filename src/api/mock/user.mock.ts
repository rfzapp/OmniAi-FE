import { delay } from "./delay";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Team";
  avatarInitials: string;
}

const user: UserProfile = {
  id: "user-1",
  name: "RFZ Digital",
  email: "abubakar@rfz.com",
  plan: "Pro",
  avatarInitials: "AM",
};

export async function fetchUser(): Promise<UserProfile> {
  return delay(user, 150);
}
