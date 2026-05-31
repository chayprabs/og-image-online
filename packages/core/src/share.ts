import type { AppMode } from "./types.js";

export interface ShareState {
  mode: AppMode;
  payload: Record<string, unknown>;
}

const MAX_SHARE_JSON_BYTES = 64 * 1024;

function isValidShareState(value: unknown): value is ShareState {
  if (!value || typeof value !== "object") return false;
  const { mode, payload } = value as ShareState;
  if (mode !== "code" && mode !== "og") return false;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
  return true;
}

export function encodeShareState(state: ShareState): string {
  const json = JSON.stringify(state);
  if (new TextEncoder().encode(json).length > MAX_SHARE_JSON_BYTES) {
    throw new Error("Share state is too large to encode in the URL");
  }
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return `#s=${b64}`;
}

export function decodeShareState(hash: string): ShareState | null {
  try {
    const match = hash.match(/#s=([A-Za-z0-9+/=]+)/);
    if (!match) return null;
    const json = decodeURIComponent(escape(atob(match[1])));
    if (new TextEncoder().encode(json).length > MAX_SHARE_JSON_BYTES) return null;
    const parsed: unknown = JSON.parse(json);
    if (!isValidShareState(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}
