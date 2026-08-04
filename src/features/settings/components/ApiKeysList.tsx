"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { AI_MODELS } from "@/features/models/data/models";

const PROVIDERS = Array.from(new Set(AI_MODELS.map((m) => m.provider)));

export function ApiKeysList() {
  const [keys, setKeys] = useState<Record<string, string>>({});

  return (
    <>
      {PROVIDERS.map((provider) => (
        <div key={provider} className="flex items-center gap-3 px-4 py-3.5">
          <KeyRound className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">{provider}</p>
            <Input
              type="password"
              placeholder="sk-••••••••••••••••"
              value={keys[provider] ?? ""}
              onChange={(e) => setKeys((prev) => ({ ...prev, [provider]: e.target.value }))}
              className="mt-1.5 max-w-sm"
            />
          </div>
          <Button variant="outline" size="sm" type="button">
            Save
          </Button>
        </div>
      ))}
    </>
  );
}
