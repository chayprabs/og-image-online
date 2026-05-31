import type { AppMode } from "./types.js";

export interface ShareState {
  mode: AppMode;
  payload: Record<string, unknown>;
}

export function encodeShareState(state: ShareState): string {
  const json = JSON.stringify(state);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return `#s=${b64}`;
}

export function decodeShareState(hash: string): ShareState | null {
  try {
    const match = hash.match(/#s=([A-Za-z0-9+/=]+)/);
    if (!match) return null;
    const json = decodeURIComponent(escape(atob(match[1])));
    return JSON.parse(json) as ShareState;
  } catch {
    return null;
  }
}
