import { describe, expect, it } from "vitest";
import { loadCustomTheme, loadTheme, renderCodeToHtml } from "./render-code.js";

async function themeBg(theme: string): Promise<string> {
  const html = await renderCodeToHtml({
    code: "x",
    language: "typescript",
    theme,
    windowChrome: "none",
    showLineNumbers: false,
    lineHighlights: [],
    diffHighlights: [],
    padding: 0,
    shadow: false,
    gradient: false,
    fontFamily: "monospace",
    fontSize: 14,
    ligatures: false,
    width: 200,
    height: 100,
  });
  const m = html.match(/\.shiki \{[^}]*background[^;]*;[^}]*\}/);
  return m?.[0] ?? html;
}

describe("loadCustomTheme", () => {
  it("loads bundled theme when JSON is name-only reference", async () => {
    await loadCustomTheme('{"name":"nord"}');
    const bg = await themeBg("nord");
    expect(bg.toLowerCase()).toContain("2e3440");
  });

  it("loadTheme and name-only custom reference produce same nord colors", async () => {
    await loadTheme("nord");
    const viaLoadTheme = await themeBg("nord");

    await loadCustomTheme('{"name":"nord"}');
    const viaCustom = await themeBg("nord");

    expect(viaCustom).toBe(viaLoadTheme);
  });
});

describe("renderCodeToHtml plaintext", () => {
  it("renders auto-detected plaintext without error", async () => {
    const html = await renderCodeToHtml({
      code: "Hello world\nplain text",
      language: "plaintext",
      theme: "github-dark",
      windowChrome: "none",
      showLineNumbers: false,
      lineHighlights: [],
      diffHighlights: [],
      padding: 8,
      shadow: false,
      gradient: false,
      fontFamily: "monospace",
      fontSize: 14,
      ligatures: false,
      width: 400,
      height: 200,
    });
    expect(html).toContain("Hello world");
    expect(html).toContain("shiki");
  });
});
