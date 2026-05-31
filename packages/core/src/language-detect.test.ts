import { describe, expect, it } from "vitest";
import { detectLanguage } from "./language-detect.js";

describe("detectLanguage", () => {
  it("detects rust", () => {
    expect(detectLanguage('fn main() {\n    println!("hi");\n}')).toBe("rust");
  });

  it("detects python", () => {
    expect(detectLanguage("def hello():\n    pass")).toBe("python");
  });

  it("detects typescript export async function", () => {
    expect(
      detectLanguage("export async function renderCode(opts): Promise<Blob> {\n  return x;\n}"),
    ).toBe("typescript");
  });

  it("detects jsx", () => {
    expect(detectLanguage("export function Card() {\n  return <div />;\n}")).toBe("jsx");
  });

  it("detects sql multiline", () => {
    expect(detectLanguage("SELECT id\nFROM posts\nWHERE x = 1")).toBe("sql");
  });

  it("detects diff", () => {
    expect(detectLanguage("@@ -1 +1 @@\n-old\n+new")).toBe("diff");
  });

  it("detects css", () => {
    expect(detectLanguage(".preview {\n  display: flex;\n}")).toBe("css");
  });

  it("detects bash shebang", () => {
    expect(detectLanguage("#!/usr/bin/env bash\necho hi")).toBe("bash");
  });

  it("respects manual override", () => {
    expect(detectLanguage("anything", "go")).toBe("go");
  });
});
