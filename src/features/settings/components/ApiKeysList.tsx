"use client";

import { useEffect, useState } from "react";
import { KeyRound, Trash2 } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { AI_MODELS } from "@/features/models/data/models";
import { settingsService, type ApiKeyEntry } from "../services/settingsService";
import { getApiErrorMessage } from "@/services/httpClient";

const PROVIDERS = Array.from(new Set(AI_MODELS.map((m) => m.provider)));

export function ApiKeysList() {
  const [keys, setKeys] = useState<Record<string, ApiKeyEntry>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingProvider, setSavingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    settingsService
      .listApiKeys()
      .then((list) => {
        setKeys(Object.fromEntries(list.map((k) => [k.provider, k])));
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(provider: string) {
    const apiKey = drafts[provider]?.trim();
    if (!apiKey) return;
    setError(null);
    setSavingProvider(provider);
    try {
      const saved = await settingsService.addApiKey(provider, apiKey);
      setKeys((prev) => ({ ...prev, [provider]: saved }));
      setDrafts((prev) => ({ ...prev, [provider]: "" }));
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSavingProvider(null);
    }
  }

  async function handleRemove(provider: string) {
    setError(null);
    setSavingProvider(provider);
    try {
      await settingsService.deleteApiKey(provider);
      setKeys((prev) => {
        const next = { ...prev };
        delete next[provider];
        return next;
      });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSavingProvider(null);
    }
  }

  if (loading) {
    return <p className="px-4 py-4 text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <>
      {error && (
        <p role="alert" className="mx-4 mt-3.5 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {PROVIDERS.map((provider) => {
        const saved = keys[provider];
        const isSaving = savingProvider === provider;
        return (
          <div key={provider} className="flex items-center gap-3 px-4 py-3.5">
            <KeyRound className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{provider}</p>
              {saved ? (
                <p className="mt-1.5 font-mono text-sm text-muted-foreground">{saved.maskedKey}</p>
              ) : (
                <Input
                  type="password"
                  placeholder="sk-••••••••••••••••"
                  value={drafts[provider] ?? ""}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [provider]: e.target.value }))}
                  className="mt-1.5 max-w-sm"
                />
              )}
            </div>
            {saved ? (
              <IconButton label={`Remove ${provider} key`} onClick={() => handleRemove(provider)} disabled={isSaving}>
                <Trash2 className="size-3.5" />
              </IconButton>
            ) : (
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => handleSave(provider)}
                disabled={isSaving || !drafts[provider]?.trim()}
              >
                {isSaving ? "Saving…" : "Save"}
              </Button>
            )}
          </div>
        );
      })}
    </>
  );
}
