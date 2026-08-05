import { useAuthStore } from "@/store/useAuthStore";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
}

export interface HttpClientOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  /** Skips the automatic refresh-and-retry-once behavior on a 401 (used for the refresh call itself). */
  skipAuthRefresh?: boolean;
}

function buildUrl(path: string, params?: HttpClientOptions["params"]): string {
  // Plain concatenation on purpose: `new URL(path, base)` treats a leading
  // "/" in `path` as root-relative to base's origin, silently dropping any
  // base path segment (e.g. the "/api" in NEXT_PUBLIC_API_BASE_URL).
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  let url = `${base}${normalizedPath}`;

  if (params) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) search.set(key, String(value));
    }
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  return url;
}

let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = rawRequest<{ accessToken: string }>("/auth/refresh", {
      method: "POST",
      skipAuthRefresh: true,
    })
      .then((data) => {
        useAuthStore.getState().setAccessToken(data.accessToken);
        return data.accessToken;
      })
      .catch(() => {
        useAuthStore.getState().clearSession();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function rawRequest<T>(path: string, options: HttpClientOptions = {}): Promise<T> {
  const { params, skipAuthRefresh, ...init } = options;
  const token = useAuthStore.getState().accessToken;

  const response = await fetch(buildUrl(path, params), {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  let body: ApiEnvelope<T> | undefined;
  try {
    body = (await response.json()) as ApiEnvelope<T>;
  } catch {
    body = undefined;
  }

  if (!response.ok) {
    if (response.status === 401 && !skipAuthRefresh) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return rawRequest<T>(path, { ...options, skipAuthRefresh: true });
      }
    }
    throw new ApiError(
      response.status,
      body?.message ?? `Request to ${path} failed with status ${response.status}`,
      body?.error,
    );
  }

  return body?.data as T;
}

export function getApiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (Array.isArray(err.details) && err.details.length > 0) {
      const first = err.details[0] as { message?: string };
      if (first?.message) return first.message;
    }
    return err.message;
  }
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export const httpClient = {
  get: <T>(path: string, options?: HttpClientOptions) => rawRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: HttpClientOptions) =>
    rawRequest<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown, options?: HttpClientOptions) =>
    rawRequest<T>(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown, options?: HttpClientOptions) =>
    rawRequest<T>(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string, options?: HttpClientOptions) => rawRequest<T>(path, { ...options, method: "DELETE" }),
};
