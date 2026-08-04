/**
 * Thin fetch wrapper reserved for real backend integration.
 * Feature services currently call `src/api/mock/*` directly; swapping a
 * service to a live API only means importing `httpClient` there instead.
 */
export interface HttpClientOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, params?: HttpClientOptions["params"]): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const url = new URL(path, base || "http://localhost");
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return base ? url.toString() : `${url.pathname}${url.search}`;
}

async function request<T>(path: string, options: HttpClientOptions = {}): Promise<T> {
  const { params, ...init } = options;
  const response = await fetch(buildUrl(path, params), {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const httpClient = {
  get: <T>(path: string, options?: HttpClientOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: HttpClientOptions) =>
    request<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown, options?: HttpClientOptions) =>
    request<T>(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string, options?: HttpClientOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
