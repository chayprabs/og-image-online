import type { CodeRenderOptions } from "./types.js";

let highlighterPromise: Promise<import("shiki").Highlighter> | null = null;
const loadedLangs = new Set<string>();
const loadedThemes = new Set<string>();

const LIGHT_THEMES = new Set([
  "github-light",
  "vitesse-light",
  "min-light",
  "solarized-light",
  "ayu-light",
]);

async function getHighlighter(): Promise<import("shiki").Highlighter> {
  const { createHighlighter } = await import("shiki");
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["typescript", "javascript", "rust", "python", "go"],
    });
    loadedThemes.add("github-dark");
    loadedThemes.add("github-light");
  }
  return highlighterPromise;
}

export async function loadLanguage(lang: string): Promise<void> {
  if (loadedLangs.has(lang)) return;
  const { bundledLanguages } = await import("shiki/langs");
  const highlighter = await getHighlighter();
  const loader = (bundledLanguages as Record<string, () => Promise<unknown>>)[lang];
  if (loader) {
    const langModule = await loader();
    await highlighter.loadLanguage(langModule as import("shiki").LanguageInput);
    loadedLangs.add(lang);
  }
}

export async function loadCustomTheme(themeJson: string): Promise<string> {
  const parsed = JSON.parse(themeJson) as { name?: string } & Record<string, unknown>;
  const highlighter = await getHighlighter();
  if (parsed.name && typeof parsed.name === "string") {
    await highlighter.loadTheme(parsed as import("shiki").ThemeInput);
    loadedThemes.add(parsed.name);
    return parsed.name;
  }
  throw new Error("Custom theme JSON must include a 'name' field");
}

export async function loadTheme(theme: string): Promise<void> {
  if (!theme || theme === "custom") return;
  if (loadedThemes.has(theme)) return;
  const { bundledThemes } = await import("shiki/themes");
  const highlighter = await getHighlighter();
  const loader = (bundledThemes as Record<string, () => Promise<unknown>>)[theme];
  if (loader) {
    await highlighter.loadTheme(
      (await loader()) as import("shiki").ThemeInput,
    );
    loadedThemes.add(theme);
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildChrome(chrome: CodeRenderOptions["windowChrome"], title: string): string {
  if (chrome === "none") return "";
  const dots =
    chrome === "macos"
      ? `<span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>`
      : `<span class="win-icon"></span>`;
  return `<div class="chrome"><div class="dots">${dots}</div><span class="title">${escapeHtml(title)}</span></div>`;
}

export async function renderCodeToHtml(opts: CodeRenderOptions): Promise<string> {
  await loadLanguage(opts.language);
  await loadTheme(opts.theme);
  const highlighter = await getHighlighter();
  const themeName = highlighter.getLoadedThemes().includes(opts.theme)
    ? opts.theme
    : "github-dark";

  let html = highlighter.codeToHtml(opts.code, {
    lang: opts.language,
    theme: themeName,
  });

  const isLight = LIGHT_THEMES.has(themeName);
  const shadow = opts.shadow
    ? "box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);"
    : "";
  const bg = opts.gradient
    ? isLight
      ? "background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);"
      : "background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);"
    : isLight
      ? "background: #f8fafc;"
      : "background: #0f172a;";
  const fontVariant = opts.ligatures ? "normal" : "no-common-ligatures";

  const highlights = new Set(opts.lineHighlights);
  const diffMap = new Map(opts.diffHighlights.map((d) => [d.line, d.type]));

  const fontFace = opts.customFontCss ? `${opts.customFontCss}\n` : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><style>
  ${fontFace}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { ${bg} padding: ${opts.padding}px; font-family: ${opts.fontFamily}, monospace; font-size: ${opts.fontSize}px; font-variant-ligatures: ${fontVariant}; }
  .frame { border-radius: 12px; overflow: hidden; ${shadow} max-width: ${opts.width}px; }
  .chrome { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: ${isLight ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.35)"}; color: ${isLight ? "#64748b" : "#94a3b8"}; font-size: 12px; }
  .dots { display: flex; gap: 6px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot.red { background: #ef4444; } .dot.yellow { background: #eab308; } .dot.green { background: #22c55e; }
  .win-icon { width: 12px; height: 12px; border: 1px solid #64748b; }
  .shiki { padding: 16px !important; overflow: auto; ${opts.showLineNumbers ? "counter-reset: line;" : ""} }
  .line { display: block; border-left: 3px solid transparent; ${opts.showLineNumbers ? "padding-left: 2.5em; position: relative;" : ""} }
  ${opts.showLineNumbers ? `.line::before { counter-increment: line; content: counter(line); position: absolute; left: 0; width: 2em; text-align: right; color: #64748b; font-size: 0.85em; opacity: 0.7; }` : ""}
  .line.hl { background: rgba(59,130,246,0.2); border-left-color: #3b82f6; }
  .line.add { background: rgba(34,197,94,0.15); }
  .line.remove { background: rgba(239,68,68,0.15); }
</style></head><body><div class="frame" id="export-root">${buildChrome(opts.windowChrome, opts.language)}${applyLineDecorations(html, highlights, diffMap)}</div></body></html>`;
}

function applyLineDecorations(
  html: string,
  highlights: Set<number>,
  diffMap: Map<number, "add" | "remove">,
): string {
  let lineNum = 0;
  return html.replace(/<span class="line/g, () => {
    lineNum += 1;
    let cls = "line";
    if (highlights.has(lineNum)) cls += " hl";
    const diff = diffMap.get(lineNum);
    if (diff === "add") cls += " add";
    if (diff === "remove") cls += " remove";
    return `<span class="${cls}`;
  });
}

export async function renderCode(opts: CodeRenderOptions): Promise<string> {
  return renderCodeToHtml(opts);
}
