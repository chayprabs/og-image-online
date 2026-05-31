import {
  BUILTIN_THEMES,
  BRAND_TEMPLATES,
  CODE_SAMPLES,
  CODE_SIZE_PRESETS,
  SIZE_PRESETS,
  decodeShareState,
  detectLanguage,
  encodeShareState,
  type AppMode,
  type ExportDpi,
  type ExportFormat,
  type WindowChrome,
} from "@social-render/core";
import { useCallback, useEffect, useMemo, useState } from "react";

export function usePlayground() {
  const [mode, setMode] = useState<AppMode>("code");
  const [code, setCode] = useState(CODE_SAMPLES[0].code);
  const [language, setLanguage] = useState("typescript");
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
  const [sizePresetId, setSizePresetId] = useState("og");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [exportDpi, setExportDpi] = useState<ExportDpi>(2);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewSvg, setPreviewSvg] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const sizePreset = useMemo(() => {
    const list = mode === "code" ? CODE_SIZE_PRESETS : SIZE_PRESETS;
    return list.find((p) => p.id === sizePresetId) ?? list[0];
  }, [mode, sizePresetId]);

  const effectiveTheme = useMemo(() => {
    if (customThemeJson.trim()) {
      try {
        const parsed = JSON.parse(customThemeJson) as { name?: string };
        return parsed.name ?? theme;
      } catch {
        return theme;
      }
    }
    return theme;
  }, [customThemeJson, theme]);

  const parsedLineHighlights = useMemo(
    () =>
      lineHighlights
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n)),
    [lineHighlights],
  );

  const detectedLang = useMemo(() => {
    if (languageManual) return language;
    return detectLanguage(code, language);
  }, [code, language, languageManual]);

  useEffect(() => {
    const fromHash = decodeShareState(window.location.hash);
    if (!fromHash) return;
    setMode(fromHash.mode);
    const p = fromHash.payload;
    if (typeof p.code === "string") setCode(p.code);
    if (typeof p.language === "string") {
      setLanguage(p.language);
      setLanguageManual(true);
    }
    if (typeof p.ogTitle === "string") setOgTitle(p.ogTitle);
    if (typeof p.ogSubtitle === "string") setOgSubtitle(p.ogSubtitle);
  }, []);

  const shareUrl = useCallback(() => {
    const hash = encodeShareState({
      mode,
      payload:
        mode === "code"
          ? { code, language: detectedLang, theme: effectiveTheme }
          : { ogTitle, ogSubtitle, brandTemplateId },
    });
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    void navigator.clipboard.writeText(url);
    setStatus("Share link copied to clipboard");
  }, [mode, code, detectedLang, effectiveTheme, ogTitle, ogSubtitle, brandTemplateId]);

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
    busy,
    setBusy,
    status,
    setStatus,
    detectedLang,
    shareUrl,
  };
}
