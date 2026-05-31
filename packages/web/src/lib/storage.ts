const KEY = "social-render:v1";

export interface PersistedState {
  mode?: "code" | "og";
  code?: string;
  language?: string;
  theme?: string;
  customThemeJson?: string;
  windowChrome?: string;
  showLineNumbers?: boolean;
  lineHighlights?: string;
  enableDiffHighlights?: boolean;
  padding?: number;
  shadow?: boolean;
  gradient?: boolean;
  fontFamily?: string;
  customFontCss?: string;
  fontSize?: number;
  ligatures?: boolean;
  codeSizePresetId?: string;
  ogSizePresetId?: string;
  ogTitle?: string;
  ogSubtitle?: string;
  ogAccent?: string;
  brandTemplateId?: string;
  ogTemplateJson?: string;
  ogLogoDataUrl?: string;
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
