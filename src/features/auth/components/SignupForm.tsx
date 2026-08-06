"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { Label } from "@/components/ui/label";
import { authService } from "../services/authService";
import { usePreferencesSync } from "@/features/settings/hooks/usePreferencesSync";
import { getApiErrorMessage } from "@/services/httpClient";

export function SignupForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const syncPreferences = usePreferencesSync();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await authService.register(name, email, password);
      await syncPreferences().catch(() => {});
      router.push(redirectTo);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
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
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
