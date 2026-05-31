import { describe, expect, it } from "vitest";
import { parseDiffHighlights } from "./parse-diff.js";

describe("parseDiffHighlights", () => {
  it("marks add and remove lines", () => {
    const code = `@@ -1 +1 @@
-old
+new`;
    const h = parseDiffHighlights(code);
    expect(h.some((x) => x.type === "remove")).toBe(true);
    expect(h.some((x) => x.type === "add")).toBe(true);
  });
});
