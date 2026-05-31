import { describe, expect, it } from "vitest";
import { decodeShareState, encodeShareState } from "./share.js";

describe("share edge cases", () => {
  const cases = [
    { name: "unicode emoji", code: 'const x = "🎉 你好";' },
    { name: "double quotes", code: 'const s = "hello \\"world\\"";' },
    { name: "single quotes", code: "const s = 'it\\'s fine';" },
    { name: "newlines and tabs", code: "line1\n\tline2\r\nline3" },
    { name: "html entities", code: "<div>&amp; &lt;script&gt;</div>" },
    { name: "null bytes escaped", code: "a\\u0000b" },
    { name: "surrogate pairs", code: "🏳️‍🌈" },
    { name: "backslashes", code: "C:\\Users\\path\\file.txt" },
    { name: "template literals", code: "const x = `${foo}`;" },
    { name: "og title with quotes", ogTitle: 'Say "hello" & goodbye' },
    { name: "og json with unicode", ogTemplateJson: '{"title":"日本語"}' },
  ];

  for (const c of cases) {
    it(`round-trips ${c.name}`, () => {
      const state =
        "code" in c || c.code !== undefined
          ? {
              mode: "code" as const,
              payload: { code: c.code!, language: "typescript", theme: "github-dark" },
            }
          : {
              mode: "og" as const,
              payload: {
                ogTitle: c.ogTitle ?? "Title",
                ogSubtitle: "Sub",
                brandTemplateId: "minimal",
                ogAccent: "#ff0000",
                ogTemplateJson: c.ogTemplateJson ?? "{}",
              },
            };
      const hash = encodeShareState(state);
      const decoded = decodeShareState(hash);
      expect(decoded).toEqual(state);
    });
  }

  it("round-trips full code mode fields", () => {
    const state = {
      mode: "code" as const,
      payload: { code: "fn main() {}", language: "rust", theme: "nord" },
    };
    expect(decodeShareState(encodeShareState(state))).toEqual(state);
  });

  it("round-trips full og mode fields", () => {
    const state = {
      mode: "og" as const,
      payload: {
        ogTitle: "T",
        ogSubtitle: "S",
        brandTemplateId: "gradient",
        ogAccent: "#abc",
        ogTemplateJson: '{"templateId":"gradient"}',
      },
    };
    expect(decodeShareState(encodeShareState(state))).toEqual(state);
  });

  it("returns null for invalid hash", () => {
    expect(decodeShareState("#s=!!!")).toBeNull();
    expect(decodeShareState("#other=abc")).toBeNull();
    expect(decodeShareState("")).toBeNull();
  });

  it("returns null for invalid mode in payload", () => {
    const bad = btoa(unescape(encodeURIComponent(JSON.stringify({ mode: "nope", payload: {} }))));
    expect(decodeShareState(`#s=${bad}`)).toBeNull();
  });

  it("throws when encoding oversized share state", () => {
    const huge = "x".repeat(70 * 1024);
    expect(() =>
      encodeShareState({ mode: "code", payload: { code: huge, language: "auto", theme: "nord" } }),
    ).toThrow(/too large/i);
  });
});
