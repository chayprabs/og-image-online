import {
  BUILTIN_THEMES,
  BRAND_TEMPLATES,
  CODE_SAMPLES,
  CODE_SIZE_PRESETS,
  SIZE_PRESETS,
} from "@social-render/core";
import { Clipboard, Download, Link2, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { usePlayground } from "../hooks/usePlayground";
import {
  copyBlobToClipboard,
  downloadExport,
  exportCodeFromHtml,
  exportOgPreview,
  updateCodePreview,
  updateOgFromFields,
} from "../lib/render";

const LANGUAGES = [
  "auto",
  "typescript",
  "javascript",
  "rust",
  "python",
  "go",
  "java",
  "bash",
  "json",
  "css",
  "html",
  "sql",
  "jsx",
  "markdown",
  "diff",
];

export default function Playground({
  initialMode,
  initialSizePresetId,
}: {
  initialMode?: "code" | "og";
  initialSizePresetId?: string;
} = {}) {
  const pg = usePlayground({ mode: initialMode, sizePresetId: initialSizePresetId });
  const previewRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const refreshPreview = useCallback(async () => {
    try {
      if (pg.mode === "code") {
        const html = await updateCodePreview({
          code: pg.code,
          language: pg.detectedLang,
          theme: pg.effectiveTheme,
          windowChrome: pg.windowChrome,
          showLineNumbers: pg.showLineNumbers,
          lineHighlights: pg.parsedLineHighlights,
          diffHighlights: pg.diffHighlights,
          padding: pg.padding,
          shadow: pg.shadow,
          gradient: pg.gradient,
          fontFamily: pg.fontFamily,
          fontSize: pg.fontSize,
          ligatures: pg.ligatures,
          customFontCss: pg.customFontCss,
          width: pg.sizePreset.width,
          height: pg.sizePreset.height,
        });
        pg.setPreviewHtml(html);
        pg.setPreviewSvg("");
        pg.setPreviewError("");
      } else if (pg.ogJsonError) {
        pg.setPreviewSvg("");
        pg.setPreviewHtml("");
      } else {
        const svg = await updateOgFromFields(
          pg.brandTemplateId,
          pg.ogTitle,
          pg.ogSubtitle,
          pg.ogAccent,
          pg.sizePreset.width,
          pg.sizePreset.height,
          pg.ogLogoDataUrl,
        );
        pg.setPreviewSvg(svg);
        pg.setPreviewHtml("");
        pg.setPreviewError("");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Preview failed";
      pg.setPreviewError(msg);
      pg.setPreviewSvg("");
      pg.setPreviewHtml("");
    }
  }, [
    pg.mode,
    pg.code,
    pg.detectedLang,
    pg.effectiveTheme,
    pg.windowChrome,
    pg.showLineNumbers,
    pg.parsedLineHighlights,
    pg.diffHighlights,
    pg.padding,
    pg.shadow,
    pg.gradient,
    pg.fontFamily,
    pg.fontSize,
    pg.ligatures,
    pg.customFontCss,
    pg.sizePreset.width,
    pg.sizePreset.height,
    pg.brandTemplateId,
    pg.ogTitle,
    pg.ogSubtitle,
    pg.ogAccent,
    pg.ogLogoDataUrl,
    pg.ogJsonError,
    pg.setPreviewHtml,
    pg.setPreviewSvg,
    pg.setPreviewError,
  ]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void refreshPreview(), 300);
    return () => clearTimeout(debounceRef.current);
  }, [refreshPreview]);

  const handleExport = async () => {
    pg.setBusy(true);
    pg.setStatus("");
    try {
      if (pg.mode === "code") {
        const html =
          pg.previewHtml ||
          (await updateCodePreview({
            code: pg.code,
            language: pg.detectedLang,
            theme: pg.effectiveTheme,
            windowChrome: pg.windowChrome,
            showLineNumbers: pg.showLineNumbers,
            lineHighlights: pg.parsedLineHighlights,
            diffHighlights: pg.diffHighlights,
            padding: pg.padding,
            shadow: pg.shadow,
            gradient: pg.gradient,
            fontFamily: pg.fontFamily,
            fontSize: pg.fontSize,
            ligatures: pg.ligatures,
            customFontCss: pg.customFontCss,
            width: pg.sizePreset.width,
            height: pg.sizePreset.height,
          }));
        const { blob, ext } = await exportCodeFromHtml(html, pg.exportFormat, pg.exportDpi);
        await downloadExport(blob, pg.exportFormat, pg.exportDpi, ext);
      } else {
        const svg = await updateOgFromFields(
          pg.brandTemplateId,
          pg.ogTitle,
          pg.ogSubtitle,
          pg.ogAccent,
          pg.sizePreset.width,
          pg.sizePreset.height,
          pg.ogLogoDataUrl,
        );
        const { blob, ext } = await exportOgPreview(
          svg,
          pg.sizePreset.width,
          pg.sizePreset.height,
          pg.exportFormat,
          pg.exportDpi,
        );
        await downloadExport(blob, pg.exportFormat, pg.exportDpi, ext);
      }
      pg.setStatus("Exported successfully");
    } catch (e) {
      pg.setStatus(e instanceof Error ? e.message : "Export failed");
    } finally {
      pg.setBusy(false);
    }
  };

  const sizePresets = pg.mode === "code" ? CODE_SIZE_PRESETS : SIZE_PRESETS;

  const handleCopy = async () => {
    pg.setBusy(true);
    try {
      if (pg.mode === "code") {
        const html =
          pg.previewHtml ||
          (await updateCodePreview({
            code: pg.code,
            language: pg.detectedLang,
            theme: pg.effectiveTheme,
            windowChrome: pg.windowChrome,
            showLineNumbers: pg.showLineNumbers,
            lineHighlights: pg.parsedLineHighlights,
            diffHighlights: pg.diffHighlights,
            padding: pg.padding,
            shadow: pg.shadow,
            gradient: pg.gradient,
            fontFamily: pg.fontFamily,
            fontSize: pg.fontSize,
            ligatures: pg.ligatures,
            customFontCss: pg.customFontCss,
            width: pg.sizePreset.width,
            height: pg.sizePreset.height,
          }));
        const { blob } = await exportCodeFromHtml(html, "png", 1);
        await copyBlobToClipboard(blob);
      } else {
        const svg = await updateOgFromFields(
          pg.brandTemplateId,
          pg.ogTitle,
          pg.ogSubtitle,
          pg.ogAccent,
          pg.sizePreset.width,
          pg.sizePreset.height,
          pg.ogLogoDataUrl,
        );
        const { blob } = await exportOgPreview(
          svg,
          pg.sizePreset.width,
          pg.sizePreset.height,
          "png",
          1,
        );
        await copyBlobToClipboard(blob);
      }
      pg.setStatus("Copied image to clipboard");
    } catch (e) {
      pg.setStatus(e instanceof Error ? e.message : "Copy failed");
    } finally {
      pg.setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        <button
          type="button"
          role="tab"
          aria-selected={pg.mode === "code"}
          onClick={() => pg.setMode("code")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            pg.mode === "code"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
          }`}
        >
          Code Image
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={pg.mode === "og"}
          onClick={() => pg.setMode("og")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            pg.mode === "og"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
          }`}
        >
          OG Image
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="order-2 space-y-4 lg:order-1">
          {pg.mode === "code" ? (
            <>
              <label className="block text-sm font-medium text-gray-700">
                Code
                <textarea
                  value={pg.code}
                  onChange={(e) => pg.setCode(e.target.value)}
                  rows={12}
                  className="mt-1 w-full resize-y rounded-lg border border-gray-200 bg-white p-3 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  spellCheck={false}
                />
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <label className="text-sm">
                  <span className="font-medium text-gray-700">Language</span>
                  <select
                    value={pg.languageManual ? pg.language : "auto"}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "auto") {
                        pg.setLanguage("auto");
                        pg.setLanguageManual(false);
                      } else {
                        pg.setLanguage(v);
                        pg.setLanguageManual(true);
                      }
                    }}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <span className="mt-0.5 block text-xs text-gray-500">
                    Detected: {pg.detectedLang}
                  </span>
                </label>

                <label className="text-sm">
                  <span className="font-medium text-gray-700">Theme</span>
                  <select
                    value={pg.theme}
                    onChange={(e) => pg.setTheme(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
                  >
                    {BUILTIN_THEMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  <span className="font-medium text-gray-700">Window</span>
                  <select
                    value={pg.windowChrome}
                    onChange={(e) =>
                      pg.setWindowChrome(e.target.value as typeof pg.windowChrome)
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
                  >
                    <option value="macos">macOS</option>
                    <option value="windows">Windows</option>
                    <option value="none">None</option>
                  </select>
                </label>
              </div>

              <details className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
                <summary className="cursor-pointer font-medium text-gray-700">
                  Advanced options
                </summary>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={pg.showLineNumbers}
                      onChange={(e) => pg.setShowLineNumbers(e.target.checked)}
                    />
                    Line numbers
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={pg.shadow}
                      onChange={(e) => pg.setShadow(e.target.checked)}
                    />
                    Shadow
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={pg.gradient}
                      onChange={(e) => pg.setGradient(e.target.checked)}
                    />
                    Gradient background
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={pg.ligatures}
                      onChange={(e) => pg.setLigatures(e.target.checked)}
                    />
                    Ligatures
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={pg.enableDiffHighlights}
                      onChange={(e) => pg.setEnableDiffHighlights(e.target.checked)}
                    />
                    Diff highlights
                  </label>
                  <label className="text-sm sm:col-span-2">
                    Upload font (.ttf, .otf, .woff)
                    <input
                      type="file"
                      accept=".ttf,.otf,.woff,.woff2"
                      className="mt-1 block w-full text-xs"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) pg.handleFontUpload(f);
                      }}
                    />
                  </label>
                  <label className="text-sm">
                    Line highlights (1,3,5)
                    <input
                      value={pg.lineHighlights}
                      onChange={(e) => pg.setLineHighlights(e.target.value)}
                      className="mt-1 w-full rounded border border-gray-200 px-2 py-1"
                    />
                  </label>
                  <label className="text-sm">
                    Padding
                    <input
                      type="number"
                      value={pg.padding}
                      onChange={(e) => pg.setPadding(Number(e.target.value))}
                      className="mt-1 w-full rounded border border-gray-200 px-2 py-1"
                    />
                  </label>
                  <label className="text-sm sm:col-span-2">
                    Custom theme JSON
                    <textarea
                      value={pg.customThemeJson}
                      onChange={(e) => pg.setCustomThemeJson(e.target.value)}
                      rows={2}
                      placeholder='{"name":"github-dark"}'
                      className="mt-1 w-full rounded border border-gray-200 p-2 font-mono text-xs"
                    />
                  </label>
                  <label className="text-sm sm:col-span-2">
                    Font family
                    <input
                      value={pg.fontFamily}
                      onChange={(e) => pg.setFontFamily(e.target.value)}
                      className="mt-1 w-full rounded border border-gray-200 px-2 py-1"
                    />
                  </label>
                  <p className="text-xs text-gray-500 sm:col-span-2">
                    Custom fonts: you are responsible for font licensing when uploading or
                    specifying fonts.
                  </p>
                </div>
              </details>

              <div>
                <span className="text-sm font-medium text-gray-700">Samples</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CODE_SAMPLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        pg.setCode(s.code);
                        pg.setLanguage(s.language);
                        pg.setLanguageManual(true);
                        if (s.language === "diff") pg.setEnableDiffHighlights(true);
                      }}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-700">
                Title
                <input
                  value={pg.ogTitle}
                  onChange={(e) => pg.setOgTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Subtitle
                <input
                  value={pg.ogSubtitle}
                  onChange={(e) => pg.setOgSubtitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Accent color
                <input
                  type="color"
                  value={pg.ogAccent}
                  onChange={(e) => pg.setOgAccent(e.target.value)}
                  className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-gray-200"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Logo upload
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-xs"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) pg.handleLogoUpload(f);
                  }}
                />
              </label>
              <details className="rounded-lg border border-gray-200 bg-white p-3 text-sm" open>
                <summary className="cursor-pointer font-medium text-gray-700">
                  Template JSON editor
                </summary>
                <textarea
                  value={pg.ogTemplateJson}
                  onChange={(e) => {
                    pg.setOgTemplateJson(e.target.value);
                    if (pg.ogJsonError) pg.setOgJsonError("");
                  }}
                  rows={8}
                  className="mt-2 w-full resize-y rounded border border-gray-200 p-2 font-mono text-xs"
                  spellCheck={false}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={pg.applyOgTemplateJson}
                    className="rounded bg-gray-900 px-3 py-1 text-xs text-white"
                  >
                    Apply JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      pg.syncOgTemplateFromVars();
                      pg.setOgJsonError("");
                    }}
                    className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-700"
                  >
                    Sync from fields
                  </button>
                </div>
                {pg.ogJsonError ? (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {pg.ogJsonError}
                  </p>
                ) : null}
              </details>
              <div>
                <span className="text-sm font-medium text-gray-700">Brand templates</span>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {BRAND_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => pg.applyBrandTemplate(t.id)}
                      className={`rounded-lg border p-3 text-left text-sm transition ${
                        pg.brandTemplateId === t.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{t.label}</div>
                      <div className="text-xs text-gray-500">{t.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-3">
            <label className="text-sm">
              <span className="font-medium text-gray-700">Size</span>
              <select
                value={pg.sizePresetId}
                onChange={(e) => pg.setSizePresetId(e.target.value)}
                className="mt-1 block rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
              >
                {sizePresets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="font-medium text-gray-700">Format</span>
              <select
                value={pg.exportFormat}
                onChange={(e) => pg.setExportFormat(e.target.value as typeof pg.exportFormat)}
                className="mt-1 block rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
                <option value="svg">SVG</option>
                <option value="avif">AVIF</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="font-medium text-gray-700">DPI</span>
              <select
                value={pg.exportDpi}
                onChange={(e) => pg.setExportDpi(Number(e.target.value) as typeof pg.exportDpi)}
                className="mt-1 block rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
              >
                <option value={1}>1×</option>
                <option value={2}>2×</option>
                <option value={3}>3×</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => void handleExport()}
              disabled={pg.busy}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {pg.busy ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
              Export
            </button>
            <button
              type="button"
              onClick={pg.shareUrl}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
            >
              <Link2 size={16} />
              Share
            </button>
            <button
              type="button"
              onClick={() => void handleCopy()}
              disabled={pg.busy}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
            >
              <Clipboard size={16} />
              Copy
            </button>
            <button
              type="button"
              onClick={pg.clearLocalData}
              title="Clear saved preferences"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {(pg.status || pg.previewError) && (
            <p
              className="flex items-center gap-2 text-sm text-gray-600"
              aria-live="polite"
              role="status"
            >
              <Sparkles size={14} className="text-blue-500" />
              {pg.busy ? pg.status : pg.status || pg.previewError}
            </p>
          )}
        </div>

        <div
          ref={previewRef}
          className="order-first flex min-h-[280px] items-start justify-center overflow-auto rounded-xl border border-gray-200 bg-white p-4 lg:order-none lg:min-h-[320px]"
        >
          {pg.mode === "code" && pg.previewHtml ? (
            <iframe
              title="Code preview"
              srcDoc={pg.previewHtml}
              className="w-full max-w-full border-0"
              style={{ minHeight: 280 }}
              sandbox="allow-same-origin"
            />
          ) : pg.mode === "og" && pg.previewSvg ? (
            <div
              className="max-w-full overflow-auto"
              role="img"
              aria-label="OG image preview"
              dangerouslySetInnerHTML={{ __html: pg.previewSvg }}
            />
          ) : pg.previewError ? (
            <p className="text-sm text-red-600">{pg.previewError}</p>
          ) : (
            <p className="text-sm text-gray-500">Generating preview…</p>
          )}
        </div>
      </div>
    </div>
  );
}
