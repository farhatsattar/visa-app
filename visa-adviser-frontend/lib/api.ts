/**
 * In the browser, prefer same-origin `/api/...` so Next can rewrite to Nest
 * (avoids CORS + wrong port). If NEXT_PUBLIC_API_URL is set, use that (e.g. mobile / direct).
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const direct = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (direct) {
      return direct;
    }
    return "";
  }
  // Server / scripts
  return process.env.INTERNAL_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:4000";
}

export function getApiV1Path(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const base = getApiBaseUrl();
  // Same-origin: "/api/..."
  if (base === "") {
    return `/api${p}`;
  }
  return `${base}${p}`;
}
