import { describe, expect, it } from "vitest";
import { detectLanguage } from "./language-detect.js";

describe("detectLanguage", () => {
  it("detects rust", () => {
    expect(detectLanguage('fn main() {\n    println!("hi");\n}')).toBe("rust");
  });

  it("detects python", () => {
    expect(detectLanguage("def hello():\n    pass")).toBe("python");
  });

  it("respects manual override", () => {
    expect(detectLanguage("anything", "go")).toBe("go");
  });
});
