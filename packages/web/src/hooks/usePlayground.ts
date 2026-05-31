import {
  BUILTIN_THEMES,
  BRAND_TEMPLATES,
  CODE_SAMPLES,
  CODE_SIZE_PRESETS,
  DEFAULT_OG_TEMPLATE_JSON,
  SIZE_PRESETS,
  decodeShareState,
  detectLanguage,
  encodeShareState,
  loadCustomTheme,
  loadTheme,
  parseDiffHighlights,
  parseOgTemplateJson,
  type AppMode,
  type ExportDpi,
  type ExportFormat,
  type WindowChrome,
} from "@social-render/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { clearPersisted, loadPersisted, savePersisted } from "../lib/storage";

export function usePlayground(initial?: { mode?: AppMode; sizePresetId?: string }) {
  const saved = typeof window !== "undefined" ? loadPersisted() : null;

  const [mode, setModeState] = useState<AppMode>(initial?.mode ?? saved?.mode ?? "code");
  const [code, setCode] = useState(saved?.code ?? CODE_SAMPLES[0].code);
  const [language, setLanguage] = useState(saved?.language ?? "auto");
  const [languageManual, setLanguageManual] = useState(
    Boolean(saved?.language && saved.language !== "auto"),
  );
  const [theme, setTheme] = useState(saved?.theme ?? BUILTIN_THEMES[0]);
  const [customThemeJson, setCustomThemeJson] = useState("");
  const [customThemeName, setCustomThemeName] = useState<string | null>(null);
  const [windowChrome, setWindowChrome] = useState<WindowChrome>("macos");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [lineHighlights, setLineHighlights] = useState("");
  const [enableDiffHighlights, setEnableDiffHighlights] = useState(false);
  const [padding, setPadding] = useState(24);
  const [shadow, setShadow] = useState(true);
  const [gradient, setGradient] = useState(true);
  const [fontFamily, setFontFamily] = useState("JetBrains Mono, monospace");
  const [customFontCss, setCustomFontCss] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [ligatures, setLigatures] = useState(true);
  const [ogTitle, setOgTitle] = useState(saved?.ogTitle ?? BRAND_TEMPLATES[0].defaultTitle);
  const [ogSubtitle, setOgSubtitle] = useState(
    saved?.ogSubtitle ?? BRAND_TEMPLATES[0].defaultSubtitle,
  );
  const [ogAccent, setOgAccent] = useState(saved?.ogAccent ?? BRAND_TEMPLATES[0].accentColor);
  const [brandTemplateId, setBrandTemplateId] = useState(
    saved?.brandTemplateId ?? BRAND_TEMPLATES[0].id,
  );
  const [ogTemplateJson, setOgTemplateJson] = useState(
    saved?.ogTemplateJson ?? DEFAULT_OG_TEMPLATE_JSON,
  );
  const [ogLogoDataUrl, setOgLogoDataUrl] = useState<string | undefined>();
  const [codeSizePresetId, setCodeSizePresetId] = useState(
    initial?.mode === "og" ? "og" : (initial?.sizePresetId ?? "auto"),
  );
  const [ogSizePresetId, setOgSizePresetId] = useState(initial?.sizePresetId ?? "og");
  const [exportFormat, setExportFormat] = useState<ExportFormat>(
    (saved?.exportFormat as ExportFormat) ?? "png",
  );
  const [exportDpi, setExportDpi] = useState<ExportDpi>((saved?.exportDpi as ExportDpi) ?? 2);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewSvg, setPreviewSvg] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [ogJsonError, setOgJsonError] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const setMode = (next: AppMode) => setModeState(next);

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

  const effectiveTheme = useMemo(
    () => customThemeName ?? theme,
    [customThemeName, theme],
  );

  useEffect(() => {
    if (!customThemeJson.trim()) {
      setCustomThemeName(null);
      return;
    }
    loadCustomTheme(customThemeJson)
      .then(setCustomThemeName)
      .catch(() => setCustomThemeName(null));
  }, [customThemeJson]);

  useEffect(() => {
    void loadTheme(theme);
  }, [theme]);

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

  const diffHighlights = useMemo(() => {
    if (!enableDiffHighlights) return [];
    const lang = languageManual ? language : detectedLang;
    if (lang === "diff") return parseDiffHighlights(code);
    return [];
  }, [enableDiffHighlights, code, detectedLang, language, languageManual]);

  useEffect(() => {
    savePersisted({
      mode,
      code,
      language,
      theme: effectiveTheme,
      ogTitle,
      ogSubtitle,
      ogAccent,
      brandTemplateId,
      ogTemplateJson,
      exportFormat,
      exportDpi,
    });
  }, [
    mode,
    code,
    language,
    effectiveTheme,
    ogTitle,
    ogSubtitle,
    ogAccent,
    brandTemplateId,
    ogTemplateJson,
    exportFormat,
    exportDpi,
  ]);

  const syncOgTemplateFromVars = useCallback(() => {
    setOgTemplateJson(
      JSON.stringify(
        {
          templateId: brandTemplateId,
          variables: { title: ogTitle, subtitle: ogSubtitle, accentColor: ogAccent },
        },
        null,
        2,
      ),
    );
  }, [brandTemplateId, ogTitle, ogSubtitle, ogAccent]);

  const applyOgTemplateFromParsed = useCallback(
    (parsed: ReturnType<typeof parseOgTemplateJson>) => {
      if (parsed.templateId) setBrandTemplateId(parsed.templateId);
      const v = parsed.variables ?? {};
      if (v.title !== undefined) setOgTitle(v.title);
      if (v.subtitle !== undefined) setOgSubtitle(v.subtitle);
      if (v.accentColor !== undefined) setOgAccent(v.accentColor);
    },
    [],
  );

  const applyOgTemplateJson = useCallback(() => {
    try {
      const parsed = parseOgTemplateJson(ogTemplateJson);
      applyOgTemplateFromParsed(parsed);
      setOgJsonError("");
      setPreviewError("");
    } catch (e) {
      setOgJsonError(e instanceof Error ? e.message : "Invalid template JSON");
      setPreviewSvg("");
    }
  }, [ogTemplateJson, applyOgTemplateFromParsed]);

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
    if (typeof p.codeSizePresetId === "string") setCodeSizePresetId(p.codeSizePresetId);
    if (typeof p.ogSizePresetId === "string") setOgSizePresetId(p.ogSizePresetId);
    if (typeof p.ogTemplateJson === "string") {
      setOgTemplateJson(p.ogTemplateJson);
      try {
        const parsed = parseOgTemplateJson(p.ogTemplateJson);
        applyOgTemplateFromParsed(parsed);
        const v = parsed.variables ?? {};
        if (v.title === undefined && typeof p.ogTitle === "string") setOgTitle(p.ogTitle);
        if (v.subtitle === undefined && typeof p.ogSubtitle === "string")
          setOgSubtitle(p.ogSubtitle);
        if (v.accentColor === undefined && typeof p.ogAccent === "string")
          setOgAccent(p.ogAccent);
        if (!parsed.templateId && typeof p.brandTemplateId === "string")
          setBrandTemplateId(p.brandTemplateId);
        setOgJsonError("");
      } catch (e) {
        setOgJsonError(e instanceof Error ? e.message : "Invalid template JSON in share link");
        if (typeof p.ogTitle === "string") setOgTitle(p.ogTitle);
        if (typeof p.ogSubtitle === "string") setOgSubtitle(p.ogSubtitle);
        if (typeof p.brandTemplateId === "string") setBrandTemplateId(p.brandTemplateId);
        if (typeof p.ogAccent === "string") setOgAccent(p.ogAccent);
      }
    } else {
      if (typeof p.ogTitle === "string") setOgTitle(p.ogTitle);
      if (typeof p.ogSubtitle === "string") setOgSubtitle(p.ogSubtitle);
      if (typeof p.brandTemplateId === "string") setBrandTemplateId(p.brandTemplateId);
      if (typeof p.ogAccent === "string") setOgAccent(p.ogAccent);
    }
  }, [applyOgTemplateFromParsed]);

  useEffect(() => {
    hydrateFromHash();
    window.addEventListener("hashchange", hydrateFromHash);
    return () => window.removeEventListener("hashchange", hydrateFromHash);
  }, [hydrateFromHash]);

  const buildOgShareJson = useCallback(
    () =>
      JSON.stringify(
        {
          templateId: brandTemplateId,
          variables: { title: ogTitle, subtitle: ogSubtitle, accentColor: ogAccent },
        },
        null,
        2,
      ),
    [brandTemplateId, ogTitle, ogSubtitle, ogAccent],
  );

  const shareUrl = useCallback(async () => {
    const hash = encodeShareState({
      mode,
      payload:
        mode === "code"
          ? {
              code,
              language: languageManual && language !== "auto" ? language : "auto",
              theme: effectiveTheme,
              codeSizePresetId,
              ogSizePresetId,
            }
          : {
              ogTitle,
              ogSubtitle,
              brandTemplateId,
              ogAccent,
              ogTemplateJson: buildOgShareJson(),
              codeSizePresetId,
              ogSizePresetId,
            },
    });
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    window.location.hash = hash.slice(1);
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Share link copied to clipboard");
    } catch {
      setStatus("Share URL updated — copy from the address bar");
    }
  }, [
    mode,
    code,
    language,
    languageManual,
    effectiveTheme,
    ogTitle,
    ogSubtitle,
    brandTemplateId,
    ogAccent,
    buildOgShareJson,
    codeSizePresetId,
    ogSizePresetId,
  ]);

  const applyBrandTemplate = (id: string) => {
    const t = BRAND_TEMPLATES.find((b) => b.id === id);
    if (!t) return;
    setBrandTemplateId(id);
    setOgTitle(t.defaultTitle);
    setOgSubtitle(t.defaultSubtitle);
    setOgAccent(t.accentColor);
    setOgTemplateJson(
      JSON.stringify(
        {
          templateId: id,
          variables: {
            title: t.defaultTitle,
            subtitle: t.defaultSubtitle,
            accentColor: t.accentColor,
          },
        },
        null,
        2,
      ),
    );
  };

  const handleFontUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    const family = "SocialRenderCustomFont";
    setCustomFontCss(
      `@font-face { font-family: '${family}'; src: url('${url}'); font-display: swap; }`,
    );
    setFontFamily(family);
    setStatus(`Font “${file.name}” loaded`);
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setOgLogoDataUrl(reader.result as string);
      setStatus(`Logo “${file.name}” added`);
    };
    reader.readAsDataURL(file);
  };

  const clearLocalData = () => {
    clearPersisted();
    setStatus("Local preferences cleared");
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
    enableDiffHighlights,
    setEnableDiffHighlights,
    diffHighlights,
    padding,
    setPadding,
    shadow,
    setShadow,
    gradient,
    setGradient,
    fontFamily,
    setFontFamily,
    customFontCss,
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
    ogTemplateJson,
    setOgTemplateJson,
    applyOgTemplateJson,
    syncOgTemplateFromVars,
    ogLogoDataUrl,
    setOgLogoDataUrl,
    handleFontUpload,
    handleLogoUpload,
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
    ogJsonError,
    setOgJsonError,
    busy,
    setBusy,
    status,
    setStatus,
    detectedLang,
    shareUrl,
    clearLocalData,
  };
}
