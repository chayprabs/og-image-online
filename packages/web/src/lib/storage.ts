const KEY = "social-render:v1";

export interface PersistedState {
  mode?: "code" | "og";
  code?: string;
  language?: string;
  theme?: string;
  ogTitle?: string;
  ogSubtitle?: string;
  ogAccent?: string;
  brandTemplateId?: string;
  ogTemplateJson?: string;
  exportFormat?: string;
  exportDpi?: number;
}

export function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export function savePersisted(state: PersistedState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function clearPersisted(): void {
  localStorage.removeItem(KEY);
}
