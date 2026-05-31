import {
  BUILTIN_THEMES,
  BRAND_TEMPLATES,
  CODE_SAMPLES,
  DEFAULT_OG_TEMPLATE_JSON,
  decodeShareState,
  parseOgTemplateJson,
  type AppMode,
  type ExportDpi,
  type ExportFormat,
  type WindowChrome,
} from "@social-render/core";
import { loadPersisted, type PersistedState } from "./storage";

export interface PlaygroundRouteInitial {
  mode?: AppMode;
  sizePresetId?: string;
}

export interface PlaygroundSnapshot {
  mode: AppMode;
  code: string;
  language: string;
  languageManual: boolean;
  theme: string;
  customThemeJson: string;
  windowChrome: WindowChrome;
  showLineNumbers: boolean;
  lineHighlights: string;
  enableDiffHighlights: boolean;
  padding: number;
  shadow: boolean;
  gradient: boolean;
  fontFamily: string;
  customFontCss: string;
  fontSize: number;
  ligatures: boolean;
  ogTitle: string;
  ogSubtitle: string;
  ogAccent: string;
  brandTemplateId: string;
  ogTemplateJson: string;
  ogLogoDataUrl?: string;
  codeSizePresetId: string;
  ogSizePresetId: string;
  exportFormat: ExportFormat;
  exportDpi: ExportDpi;
}

const DEFAULTS: PlaygroundSnapshot = {
  mode: "code",
  code: CODE_SAMPLES[0].code,
  language: "auto",
  languageManual: false,
  theme: BUILTIN_THEMES[0],
  customThemeJson: "",
  windowChrome: "macos",
  showLineNumbers: true,
  lineHighlights: "",
  enableDiffHighlights: false,
  padding: 24,
  shadow: true,
  gradient: true,
  fontFamily: "JetBrains Mono, monospace",
  customFontCss: "",
  fontSize: 14,
  ligatures: true,
  ogTitle: BRAND_TEMPLATES[0].defaultTitle,
  ogSubtitle: BRAND_TEMPLATES[0].defaultSubtitle,
  ogAccent: BRAND_TEMPLATES[0].accentColor,
  brandTemplateId: BRAND_TEMPLATES[0].id,
  ogTemplateJson: DEFAULT_OG_TEMPLATE_JSON,
  codeSizePresetId: "auto",
  ogSizePresetId: "og",
  exportFormat: "png",
  exportDpi: 2,
};

function num(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function applyOgTemplateFromPayload(
  state: PlaygroundSnapshot,
  p: Record<string, unknown>,
): PlaygroundSnapshot {
  if (typeof p.ogTemplateJson !== "string") return state;
  let next = { ...state, ogTemplateJson: p.ogTemplateJson };
  try {
    const parsed = parseOgTemplateJson(p.ogTemplateJson);
    if (parsed.templateId) next = { ...next, brandTemplateId: parsed.templateId };
    const v = parsed.variables ?? {};
    if (v.title !== undefined) next = { ...next, ogTitle: v.title };
    if (v.subtitle !== undefined) next = { ...next, ogSubtitle: v.subtitle };
    if (v.accentColor !== undefined) next = { ...next, ogAccent: v.accentColor };
    if (v.title === undefined && typeof p.ogTitle === "string")
      next = { ...next, ogTitle: p.ogTitle };
    if (v.subtitle === undefined && typeof p.ogSubtitle === "string")
      next = { ...next, ogSubtitle: p.ogSubtitle };
    if (v.accentColor === undefined && typeof p.ogAccent === "string")
      next = { ...next, ogAccent: p.ogAccent };
    if (!parsed.templateId && typeof p.brandTemplateId === "string")
      next = { ...next, brandTemplateId: p.brandTemplateId };
  } catch {
    if (typeof p.ogTitle === "string") next = { ...next, ogTitle: p.ogTitle };
    if (typeof p.ogSubtitle === "string") next = { ...next, ogSubtitle: p.ogSubtitle };
    if (typeof p.brandTemplateId === "string")
      next = { ...next, brandTemplateId: p.brandTemplateId };
    if (typeof p.ogAccent === "string") next = { ...next, ogAccent: p.ogAccent };
  }
  return next;
}

function mergeFromPayload(
  base: PlaygroundSnapshot,
  p: Record<string, unknown>,
  mode: AppMode,
): PlaygroundSnapshot {
  const next = { ...base, mode };
  if (typeof p.code === "string") next.code = p.code;
  if (typeof p.language === "string") {
    next.language = p.language;
    next.languageManual = p.language !== "auto";
  }
  if (typeof p.theme === "string") {
    next.theme = p.theme;
    next.customThemeJson = "";
  }
  if (typeof p.customThemeJson === "string") {
    next.customThemeJson = p.customThemeJson;
  }
  if (typeof p.windowChrome === "string") next.windowChrome = p.windowChrome as WindowChrome;
  if (typeof p.showLineNumbers === "boolean") next.showLineNumbers = p.showLineNumbers;
  if (typeof p.lineHighlights === "string") next.lineHighlights = p.lineHighlights;
  if (typeof p.enableDiffHighlights === "boolean")
    next.enableDiffHighlights = p.enableDiffHighlights;
  if (typeof p.padding === "number") next.padding = p.padding;
  if (typeof p.shadow === "boolean") next.shadow = p.shadow;
  if (typeof p.gradient === "boolean") next.gradient = p.gradient;
  if (typeof p.fontFamily === "string") next.fontFamily = p.fontFamily;
  if (typeof p.customFontCss === "string") next.customFontCss = p.customFontCss;
  if (typeof p.fontSize === "number") next.fontSize = p.fontSize;
  if (typeof p.ligatures === "boolean") next.ligatures = p.ligatures;
  if (typeof p.codeSizePresetId === "string") next.codeSizePresetId = p.codeSizePresetId;
  if (typeof p.ogSizePresetId === "string") next.ogSizePresetId = p.ogSizePresetId;
  if (typeof p.exportFormat === "string") next.exportFormat = p.exportFormat as ExportFormat;
  if (typeof p.exportDpi === "number") next.exportDpi = p.exportDpi as ExportDpi;
  if (typeof p.ogTitle === "string") next.ogTitle = p.ogTitle;
  if (typeof p.ogSubtitle === "string") next.ogSubtitle = p.ogSubtitle;
  if (typeof p.brandTemplateId === "string") next.brandTemplateId = p.brandTemplateId;
  if (typeof p.ogAccent === "string") next.ogAccent = p.ogAccent;
  if (typeof p.ogTemplateJson === "string") next.ogTemplateJson = p.ogTemplateJson;
  if (typeof p.ogLogoDataUrl === "string") next.ogLogoDataUrl = p.ogLogoDataUrl;
  if (mode === "og" && typeof p.ogSizePresetId === "string") {
    next.ogSizePresetId = p.ogSizePresetId;
  }
  return next;
}

function mergeFromSaved(base: PlaygroundSnapshot, saved: PersistedState): PlaygroundSnapshot {
  return {
    ...base,
    mode: saved.mode ?? base.mode,
    code: saved.code ?? base.code,
    language: saved.language ?? base.language,
    languageManual: Boolean(saved.language && saved.language !== "auto"),
    theme: saved.theme ?? base.theme,
    customThemeJson: saved.customThemeJson ?? base.customThemeJson,
    windowChrome: (saved.windowChrome as WindowChrome) ?? base.windowChrome,
    showLineNumbers: saved.showLineNumbers ?? base.showLineNumbers,
    lineHighlights: saved.lineHighlights ?? base.lineHighlights,
    enableDiffHighlights: saved.enableDiffHighlights ?? base.enableDiffHighlights,
    padding: num(saved.padding, base.padding),
    shadow: saved.shadow ?? base.shadow,
    gradient: saved.gradient ?? base.gradient,
    fontFamily: saved.fontFamily ?? base.fontFamily,
    customFontCss: saved.customFontCss ?? base.customFontCss,
    fontSize: num(saved.fontSize, base.fontSize),
    ligatures: saved.ligatures ?? base.ligatures,
    ogTitle: saved.ogTitle ?? base.ogTitle,
    ogSubtitle: saved.ogSubtitle ?? base.ogSubtitle,
    ogAccent: saved.ogAccent ?? base.ogAccent,
    brandTemplateId: saved.brandTemplateId ?? base.brandTemplateId,
    ogTemplateJson: saved.ogTemplateJson ?? base.ogTemplateJson,
    ogLogoDataUrl: saved.ogLogoDataUrl ?? base.ogLogoDataUrl,
    codeSizePresetId: saved.codeSizePresetId ?? base.codeSizePresetId,
    ogSizePresetId: saved.ogSizePresetId ?? base.ogSizePresetId,
    exportFormat: (saved.exportFormat as ExportFormat) ?? base.exportFormat,
    exportDpi: (saved.exportDpi as ExportDpi) ?? base.exportDpi,
  };
}

export function resolveInitialPlaygroundState(
  routeInitial?: PlaygroundRouteInitial,
): PlaygroundSnapshot {
  let state: PlaygroundSnapshot = { ...DEFAULTS };

  if (routeInitial?.mode) {
    state.mode = routeInitial.mode;
    if (routeInitial.mode === "og") {
      state.codeSizePresetId = "og";
      if (routeInitial.sizePresetId) state.ogSizePresetId = routeInitial.sizePresetId;
    } else if (routeInitial.sizePresetId) {
      state.codeSizePresetId = routeInitial.sizePresetId;
    }
  }

  const saved = typeof window !== "undefined" ? loadPersisted() : null;
  if (saved) state = mergeFromSaved(state, saved);

  if (routeInitial?.mode) {
    state.mode = routeInitial.mode;
    if (routeInitial.sizePresetId) {
      if (routeInitial.mode === "og") state.ogSizePresetId = routeInitial.sizePresetId;
      else state.codeSizePresetId = routeInitial.sizePresetId;
    }
  }

  const fromHash =
    typeof window !== "undefined" ? decodeShareState(window.location.hash) : null;
  if (fromHash) {
    state = mergeFromPayload(state, fromHash.payload, fromHash.mode);
    state = applyOgTemplateFromPayload(state, fromHash.payload);
  }

  return state;
}

export function snapshotToPersisted(s: PlaygroundSnapshot): PersistedState {
  return {
    mode: s.mode,
    code: s.code,
    language: s.language,
    theme: s.theme,
    customThemeJson: s.customThemeJson || undefined,
    windowChrome: s.windowChrome,
    showLineNumbers: s.showLineNumbers,
    lineHighlights: s.lineHighlights,
    enableDiffHighlights: s.enableDiffHighlights,
    padding: s.padding,
    shadow: s.shadow,
    gradient: s.gradient,
    fontFamily: s.fontFamily,
    customFontCss: s.customFontCss || undefined,
    fontSize: s.fontSize,
    ligatures: s.ligatures,
    ogTitle: s.ogTitle,
    ogSubtitle: s.ogSubtitle,
    ogAccent: s.ogAccent,
    brandTemplateId: s.brandTemplateId,
    ogTemplateJson: s.ogTemplateJson,
    ogLogoDataUrl: s.ogLogoDataUrl,
    codeSizePresetId: s.codeSizePresetId,
    ogSizePresetId: s.ogSizePresetId,
    exportFormat: s.exportFormat,
    exportDpi: s.exportDpi,
  };
}

export function buildCodeSharePayload(s: PlaygroundSnapshot): Record<string, unknown> {
  return {
    code: s.code,
    language: s.languageManual && s.language !== "auto" ? s.language : "auto",
    theme: s.theme,
    customThemeJson: s.customThemeJson || undefined,
    windowChrome: s.windowChrome,
    showLineNumbers: s.showLineNumbers,
    lineHighlights: s.lineHighlights,
    enableDiffHighlights: s.enableDiffHighlights,
    padding: s.padding,
    shadow: s.shadow,
    gradient: s.gradient,
    fontFamily: s.fontFamily,
    customFontCss: s.customFontCss || undefined,
    fontSize: s.fontSize,
    ligatures: s.ligatures,
    codeSizePresetId: s.codeSizePresetId,
    ogSizePresetId: s.ogSizePresetId,
    exportFormat: s.exportFormat,
    exportDpi: s.exportDpi,
  };
}

export function buildOgSharePayload(s: PlaygroundSnapshot): Record<string, unknown> {
  return {
    ogTitle: s.ogTitle,
    ogSubtitle: s.ogSubtitle,
    brandTemplateId: s.brandTemplateId,
    ogAccent: s.ogAccent,
    ogTemplateJson: s.ogTemplateJson,
    ogLogoDataUrl: s.ogLogoDataUrl,
    codeSizePresetId: s.codeSizePresetId,
    ogSizePresetId: s.ogSizePresetId,
    exportFormat: s.exportFormat,
    exportDpi: s.exportDpi,
  };
}

export { DEFAULTS as PLAYGROUND_DEFAULTS, mergeFromPayload };
