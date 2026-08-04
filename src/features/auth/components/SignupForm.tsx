"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";

export function SignupForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(email, name);
    router.push(redirectTo);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="signup-name">Name</Label>
        <Input
          id="signup-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ada Lovelace"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      <Button type="submit" className="w-full">
        Create account
      </Button>
    </form>
  );
}
