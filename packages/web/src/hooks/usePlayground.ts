import {
  BUILTIN_THEMES,
  BRAND_TEMPLATES,
  CODE_SAMPLES,
  CODE_SIZE_PRESETS,
  SIZE_PRESETS,
  decodeShareState,
  detectLanguage,
  encodeShareState,
  loadTheme,
  type AppMode,
  type ExportDpi,
  type ExportFormat,
  type WindowChrome,
} from "@social-render/core";
import { useCallback, useEffect, useMemo, useState } from "react";

function defaultPresetForMode(mode: AppMode): string {
  return mode === "code" ? "auto" : "og";
}

export function usePlayground(initial?: { mode?: AppMode; sizePresetId?: string }) {
  const [mode, setModeState] = useState<AppMode>(initial?.mode ?? "code");
  const [code, setCode] = useState(CODE_SAMPLES[0].code);
  const [language, setLanguage] = useState("auto");
  const [languageManual, setLanguageManual] = useState(false);
  const [theme, setTheme] = useState<string>(BUILTIN_THEMES[0]);
  const [customThemeJson, setCustomThemeJson] = useState("");
  const [windowChrome, setWindowChrome] = useState<WindowChrome>("macos");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [lineHighlights, setLineHighlights] = useState("");
  const [padding, setPadding] = useState(24);
  const [shadow, setShadow] = useState(true);
  const [gradient, setGradient] = useState(true);
  const [fontFamily, setFontFamily] = useState("JetBrains Mono, monospace");
  const [fontSize, setFontSize] = useState(14);
  const [ligatures, setLigatures] = useState(true);
  const [ogTitle, setOgTitle] = useState(BRAND_TEMPLATES[0].defaultTitle);
  const [ogSubtitle, setOgSubtitle] = useState(BRAND_TEMPLATES[0].defaultSubtitle);
  const [ogAccent, setOgAccent] = useState(BRAND_TEMPLATES[0].accentColor);
  const [brandTemplateId, setBrandTemplateId] = useState(BRAND_TEMPLATES[0].id);
  const [codeSizePresetId, setCodeSizePresetId] = useState(
    initial?.mode === "og" ? "og" : (initial?.sizePresetId ?? "auto"),
  );
  const [ogSizePresetId, setOgSizePresetId] = useState(
    initial?.sizePresetId ?? "og",
  );
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [exportDpi, setExportDpi] = useState<ExportDpi>(2);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewSvg, setPreviewSvg] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const setMode = (next: AppMode) => {
    setModeState(next);
  };

  const sizePresetId = mode === "code" ? codeSizePresetId : ogSizePresetId;
  const setSizePresetId = (id: string) => {
    if (mode === "code") setCodeSizePresetId(id);
    else setOgSizePresetId(id);
  };

  const sizePreset = useMemo(() => {
    const list = mode === "code" ? CODE_SIZE_PRESETS : SIZE_PRESETS;
    const id = mode === "code" ? codeSizePresetId : ogSizePresetId;
    return list.find((p) => p.id === id) ?? list[0];
  }, [mode, codeSizePresetId, ogSizePresetId]);

  const effectiveTheme = useMemo(() => theme, [theme]);

  useEffect(() => {
    if (!customThemeJson.trim()) return;
    try {
      const parsed = JSON.parse(customThemeJson) as { name?: string };
      if (parsed.name) void loadTheme(parsed.name);
    } catch {
      /* ignore invalid JSON */
    }
  }, [customThemeJson]);

  useEffect(() => {
    void loadTheme(effectiveTheme);
  }, [effectiveTheme]);

  const parsedLineHighlights = useMemo(
    () =>
      lineHighlights
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n)),
    [lineHighlights],
  );

  const detectedLang = useMemo(() => {
    if (languageManual && language !== "auto") return language;
    return detectLanguage(code);
  }, [code, language, languageManual]);

  const hydrateFromHash = useCallback(() => {
    const fromHash = decodeShareState(window.location.hash);
    if (!fromHash) return;
    setModeState(fromHash.mode);
    const p = fromHash.payload;
    if (typeof p.code === "string") setCode(p.code);
    if (typeof p.language === "string") {
      setLanguage(p.language);
      setLanguageManual(p.language !== "auto");
    }
    if (typeof p.theme === "string") setTheme(p.theme);
    if (typeof p.ogTitle === "string") setOgTitle(p.ogTitle);
    if (typeof p.ogSubtitle === "string") setOgSubtitle(p.ogSubtitle);
    if (typeof p.brandTemplateId === "string") setBrandTemplateId(p.brandTemplateId);
    if (typeof p.ogAccent === "string") setOgAccent(p.ogAccent);
  }, []);

  useEffect(() => {
    hydrateFromHash();
    window.addEventListener("hashchange", hydrateFromHash);
    return () => window.removeEventListener("hashchange", hydrateFromHash);
  }, [hydrateFromHash]);

  const shareUrl = useCallback(async () => {
    const hash = encodeShareState({
      mode,
      payload:
        mode === "code"
          ? { code, language: detectedLang, theme: effectiveTheme }
          : { ogTitle, ogSubtitle, brandTemplateId, ogAccent },
    });
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    window.location.hash = hash.slice(1);
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Share link copied to clipboard");
    } catch {
      setStatus("Share URL updated — copy from the address bar");
    }
  }, [mode, code, detectedLang, effectiveTheme, ogTitle, ogSubtitle, brandTemplateId, ogAccent]);

  const applyBrandTemplate = (id: string) => {
    const t = BRAND_TEMPLATES.find((b) => b.id === id);
    if (!t) return;
    setBrandTemplateId(id);
    setOgTitle(t.defaultTitle);
    setOgSubtitle(t.defaultSubtitle);
    setOgAccent(t.accentColor);
  };

  return {
    mode,
    setMode,
    code,
    setCode,
    language,
    setLanguage,
    languageManual,
    setLanguageManual,
    theme,
    setTheme,
    customThemeJson,
    setCustomThemeJson,
    effectiveTheme,
    windowChrome,
    setWindowChrome,
    showLineNumbers,
    setShowLineNumbers,
    lineHighlights,
    setLineHighlights,
    parsedLineHighlights,
    padding,
    setPadding,
    shadow,
    setShadow,
    gradient,
    setGradient,
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    ligatures,
    setLigatures,
    ogTitle,
    setOgTitle,
    ogSubtitle,
    setOgSubtitle,
    ogAccent,
    setOgAccent,
    brandTemplateId,
    applyBrandTemplate,
    sizePresetId,
    setSizePresetId,
    sizePreset,
    exportFormat,
    setExportFormat,
    exportDpi,
    setExportDpi,
    previewHtml,
    setPreviewHtml,
    previewSvg,
    setPreviewSvg,
    previewError,
    setPreviewError,
    busy,
    setBusy,
    status,
    setStatus,
    detectedLang,
    shareUrl,
    defaultPresetForMode,
  };
}
