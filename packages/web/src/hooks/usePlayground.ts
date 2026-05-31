import {
  BRAND_TEMPLATES,
  CODE_SIZE_PRESETS,
  SIZE_PRESETS,
  decodeShareState,
  encodeShareState,
  loadCustomTheme,
  loadTheme,
  parseDiffHighlights,
  parseOgTemplateJson,
  detectLanguage,
  type AppMode,
  type ExportDpi,
  type ExportFormat,
  type WindowChrome,
} from "@social-render/core";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  PLAYGROUND_DEFAULTS,
  buildCodeSharePayload,
  buildOgSharePayload,
  mergeFromPayload,
  resolveInitialPlaygroundState,
  snapshotToPersisted,
  type PlaygroundRouteInitial,
  type PlaygroundSnapshot,
} from "../lib/playground-state";
import { clearPersisted, savePersisted } from "../lib/storage";

export function usePlayground(initial?: PlaygroundRouteInitial) {
  const [init] = useState(() => resolveInitialPlaygroundState(initial));
  const persistReady = useRef(false);
  const blockPersistRef = useRef(false);

  const withPersist = useCallback(
    <T,>(setter: Dispatch<SetStateAction<T>>) =>
      (value: SetStateAction<T>) => {
        blockPersistRef.current = false;
        setter(value);
      },
    [],
  );

  const [mode, setModeState] = useState<AppMode>(init.mode);
  const [code, setCode] = useState(init.code);
  const [language, setLanguage] = useState(init.language);
  const [languageManual, setLanguageManual] = useState(init.languageManual);
  const [theme, setTheme] = useState(init.theme);
  const [customThemeJson, setCustomThemeJson] = useState(init.customThemeJson);
  const [customThemeName, setCustomThemeName] = useState<string | null>(null);
  const [windowChrome, setWindowChrome] = useState<WindowChrome>(init.windowChrome);
  const [showLineNumbers, setShowLineNumbers] = useState(init.showLineNumbers);
  const [lineHighlights, setLineHighlights] = useState(init.lineHighlights);
  const [enableDiffHighlights, setEnableDiffHighlights] = useState(init.enableDiffHighlights);
  const [padding, setPadding] = useState(init.padding);
  const [shadow, setShadow] = useState(init.shadow);
  const [gradient, setGradient] = useState(init.gradient);
  const [fontFamily, setFontFamily] = useState(init.fontFamily);
  const [customFontCss, setCustomFontCss] = useState(init.customFontCss);
  const [fontSize, setFontSize] = useState(init.fontSize);
  const [ligatures, setLigatures] = useState(init.ligatures);
  const [ogTitle, setOgTitle] = useState(init.ogTitle);
  const [ogSubtitle, setOgSubtitle] = useState(init.ogSubtitle);
  const [ogAccent, setOgAccent] = useState(init.ogAccent);
  const [brandTemplateId, setBrandTemplateId] = useState(init.brandTemplateId);
  const [ogTemplateJson, setOgTemplateJson] = useState(init.ogTemplateJson);
  const [ogLogoDataUrl, setOgLogoDataUrl] = useState<string | undefined>(init.ogLogoDataUrl);
  const [codeSizePresetId, setCodeSizePresetId] = useState(init.codeSizePresetId);
  const [ogSizePresetId, setOgSizePresetId] = useState(init.ogSizePresetId);
  const [exportFormat, setExportFormat] = useState<ExportFormat>(init.exportFormat);
  const [exportDpi, setExportDpi] = useState<ExportDpi>(init.exportDpi);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewSvg, setPreviewSvg] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [ogJsonError, setOgJsonError] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const snapshot = useMemo(
    (): PlaygroundSnapshot => ({
      mode,
      code,
      language,
      languageManual,
      theme,
      customThemeJson,
      windowChrome,
      showLineNumbers,
      lineHighlights,
      enableDiffHighlights,
      padding,
      shadow,
      gradient,
      fontFamily,
      customFontCss,
      fontSize,
      ligatures,
      ogTitle,
      ogSubtitle,
      ogAccent,
      brandTemplateId,
      ogTemplateJson,
      ogLogoDataUrl,
      codeSizePresetId,
      ogSizePresetId,
      exportFormat,
      exportDpi,
    }),
    [
      mode,
      code,
      language,
      languageManual,
      theme,
      customThemeJson,
      windowChrome,
      showLineNumbers,
      lineHighlights,
      enableDiffHighlights,
      padding,
      shadow,
      gradient,
      fontFamily,
      customFontCss,
      fontSize,
      ligatures,
      ogTitle,
      ogSubtitle,
      ogAccent,
      brandTemplateId,
      ogTemplateJson,
      ogLogoDataUrl,
      codeSizePresetId,
      ogSizePresetId,
      exportFormat,
      exportDpi,
    ],
  );

  const sizePresetId = mode === "code" ? codeSizePresetId : ogSizePresetId;
  const setSizePresetId = useCallback(
    (id: string) => {
      blockPersistRef.current = false;
      if (mode === "code") setCodeSizePresetId(id);
      else setOgSizePresetId(id);
    },
    [mode],
  );

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

  useEffect(() => {
    persistReady.current = true;
  }, []);

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
    if (!persistReady.current || blockPersistRef.current) return;
    savePersisted(snapshotToPersisted(snapshot));
  }, [snapshot]);

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

  const applySnapshot = useCallback((next: PlaygroundSnapshot) => {
      setModeState(next.mode);
      setCode(next.code);
      setLanguage(next.language);
      setLanguageManual(next.languageManual);
      setTheme(next.theme);
      setCustomThemeJson(next.customThemeJson);
      setWindowChrome(next.windowChrome);
      setShowLineNumbers(next.showLineNumbers);
      setLineHighlights(next.lineHighlights);
      setEnableDiffHighlights(next.enableDiffHighlights);
      setPadding(next.padding);
      setShadow(next.shadow);
      setGradient(next.gradient);
      setFontFamily(next.fontFamily);
      setCustomFontCss(next.customFontCss);
      setFontSize(next.fontSize);
      setLigatures(next.ligatures);
      setOgTitle(next.ogTitle);
      setOgSubtitle(next.ogSubtitle);
      setOgAccent(next.ogAccent);
      setBrandTemplateId(next.brandTemplateId);
      setOgTemplateJson(next.ogTemplateJson);
      setOgLogoDataUrl(next.ogLogoDataUrl);
      setCodeSizePresetId(next.codeSizePresetId);
      setOgSizePresetId(next.ogSizePresetId);
      setExportFormat(next.exportFormat);
      setExportDpi(next.exportDpi);
    },
    [],
  );

  const hydrateFromHash = useCallback(() => {
    const fromHash = decodeShareState(window.location.hash);
    if (!fromHash) return;

    let next = mergeFromPayload(snapshot, fromHash.payload, fromHash.mode);
    let ogJsonWarning = "";

    if (typeof fromHash.payload.ogTemplateJson === "string") {
      try {
        const parsed = parseOgTemplateJson(fromHash.payload.ogTemplateJson);
        if (parsed.templateId) next = { ...next, brandTemplateId: parsed.templateId };
        const v = parsed.variables ?? {};
        if (v.title !== undefined) next = { ...next, ogTitle: v.title };
        if (v.subtitle !== undefined) next = { ...next, ogSubtitle: v.subtitle };
        if (v.accentColor !== undefined) next = { ...next, ogAccent: v.accentColor };
        const p = fromHash.payload;
        if (v.title === undefined && typeof p.ogTitle === "string")
          next = { ...next, ogTitle: p.ogTitle };
        if (v.subtitle === undefined && typeof p.ogSubtitle === "string")
          next = { ...next, ogSubtitle: p.ogSubtitle };
        if (v.accentColor === undefined && typeof p.ogAccent === "string")
          next = { ...next, ogAccent: p.ogAccent };
        if (!parsed.templateId && typeof p.brandTemplateId === "string")
          next = { ...next, brandTemplateId: p.brandTemplateId };
      } catch {
        ogJsonWarning = "Template JSON in share link was invalid — other fields were restored";
      }
    }

    applySnapshot(next);
    if (ogJsonWarning) setStatus(ogJsonWarning);
  }, [snapshot, applySnapshot]);

  useEffect(() => {
    const onHashChange = () => hydrateFromHash();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [hydrateFromHash]);

  const shareUrl = useCallback(async () => {
    try {
      const hash = encodeShareState({
        mode,
        payload:
          mode === "code" ? buildCodeSharePayload(snapshot) : buildOgSharePayload(snapshot),
      });
      const url = `${window.location.origin}${window.location.pathname}${hash}`;
      window.location.hash = hash.slice(1);
      try {
        await navigator.clipboard.writeText(url);
        setStatus("Share link copied to clipboard");
      } catch {
        setStatus("Share URL updated — copy from the address bar");
      }
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Share failed");
    }
  }, [mode, snapshot]);

  const applyBrandTemplate = (id: string) => {
    blockPersistRef.current = false;
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
    setOgJsonError("");
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
    blockPersistRef.current = true;
    clearPersisted();
    let reset: PlaygroundSnapshot = { ...PLAYGROUND_DEFAULTS };
    if (initial?.mode) {
      reset.mode = initial.mode;
      if (initial.sizePresetId) {
        if (initial.mode === "og") reset.ogSizePresetId = initial.sizePresetId;
        else reset.codeSizePresetId = initial.sizePresetId;
      }
    }
    applySnapshot(reset);
    setPreviewHtml("");
    setPreviewSvg("");
    setPreviewError("");
    setStatus("Local preferences cleared");
  };

  const setMode = useCallback((next: AppMode) => {
    blockPersistRef.current = false;
    setModeState(next);
  }, []);

  return {
    mode,
    setMode,
    code,
    setCode: withPersist(setCode),
    language,
    setLanguage: withPersist(setLanguage),
    languageManual,
    setLanguageManual: withPersist(setLanguageManual),
    theme,
    setTheme: withPersist(setTheme),
    customThemeJson,
    setCustomThemeJson: withPersist(setCustomThemeJson),
    customThemeName,
    effectiveTheme,
    windowChrome,
    setWindowChrome: withPersist(setWindowChrome),
    showLineNumbers,
    setShowLineNumbers: withPersist(setShowLineNumbers),
    lineHighlights,
    setLineHighlights: withPersist(setLineHighlights),
    parsedLineHighlights,
    enableDiffHighlights,
    setEnableDiffHighlights: withPersist(setEnableDiffHighlights),
    diffHighlights,
    padding,
    setPadding: withPersist(setPadding),
    shadow,
    setShadow: withPersist(setShadow),
    gradient,
    setGradient: withPersist(setGradient),
    fontFamily,
    setFontFamily: withPersist(setFontFamily),
    customFontCss,
    fontSize,
    setFontSize: withPersist(setFontSize),
    ligatures,
    setLigatures: withPersist(setLigatures),
    ogTitle,
    setOgTitle: withPersist(setOgTitle),
    ogSubtitle,
    setOgSubtitle: withPersist(setOgSubtitle),
    ogAccent,
    setOgAccent: withPersist(setOgAccent),
    brandTemplateId,
    applyBrandTemplate,
    ogTemplateJson,
    setOgTemplateJson: withPersist(setOgTemplateJson),
    applyOgTemplateJson,
    syncOgTemplateFromVars,
    ogLogoDataUrl,
    setOgLogoDataUrl: withPersist(setOgLogoDataUrl),
    handleFontUpload,
    handleLogoUpload,
    sizePresetId,
    setSizePresetId,
    sizePreset,
    exportFormat,
    setExportFormat: withPersist(setExportFormat),
    exportDpi,
    setExportDpi: withPersist(setExportDpi),
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
