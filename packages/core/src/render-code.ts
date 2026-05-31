import type { CodeRenderOptions } from "./types.js";

let highlighterPromise: Promise<import("shiki").Highlighter> | null = null;
const loadedLangs = new Set<string>();

async function getHighlighter(theme: string): Promise<import("shiki").Highlighter> {
  const { createHighlighter } = await import("shiki");
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark", "github-light", "one-dark-pro", "dracula", "nord"],
      langs: ["typescript", "javascript", "rust", "python", "go"],
    });
  }
  const highlighter = await highlighterPromise;
  return highlighter;
}

export async function loadLanguage(lang: string): Promise<void> {
  if (loadedLangs.has(lang)) return;
  const { bundledLanguages } = await import("shiki/langs");
  const highlighter = await getHighlighter("github-dark");
  const loader = (bundledLanguages as Record<string, () => Promise<unknown>>)[lang];
  if (loader) {
    const langModule = await loader();
    await highlighter.loadLanguage(langModule as import("shiki").LanguageInput);
    loadedLangs.add(lang);
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
  const highlighter = await getHighlighter(opts.theme);
  const themeName = highlighter.getLoadedThemes().includes(opts.theme)
    ? opts.theme
    : "github-dark";

  let html = highlighter.codeToHtml(opts.code, {
    lang: opts.language,
    theme: themeName,
  });

  if (!opts.showLineNumbers) {
    html = html.replace(/class="line"/g, 'class="line no-num"');
  }

  const shadow = opts.shadow
    ? "box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);"
    : "";
  const bg = opts.gradient
    ? "background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);"
    : "background: #0f172a;";
  const fontVariant = opts.ligatures ? "normal" : "no-common-ligatures";

  const highlights = new Set(opts.lineHighlights);
  const diffMap = new Map(opts.diffHighlights.map((d) => [d.line, d.type]));

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { ${bg} padding: ${opts.padding}px; font-family: ${opts.fontFamily}, monospace; font-size: ${opts.fontSize}px; font-variant-ligatures: ${fontVariant}; }
  .frame { border-radius: 12px; overflow: hidden; ${shadow} max-width: ${opts.width}px; }
  .chrome { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(0,0,0,0.35); color: #94a3b8; font-size: 12px; }
  .dots { display: flex; gap: 6px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot.red { background: #ef4444; } .dot.yellow { background: #eab308; } .dot.green { background: #22c55e; }
  .win-icon { width: 12px; height: 12px; border: 1px solid #64748b; }
  .shiki { padding: 16px !important; overflow: auto; }
  .line { display: block; padding-left: 8px; border-left: 3px solid transparent; }
  .line.hl { background: rgba(59,130,246,0.2); border-left-color: #3b82f6; }
  .line.add { background: rgba(34,197,94,0.15); }
  .line.remove { background: rgba(239,68,68,0.15); }
</style></head><body><div class="frame">${buildChrome(opts.windowChrome, opts.language)}${applyLineDecorations(html, highlights, diffMap)}</div></body></html>`;
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
