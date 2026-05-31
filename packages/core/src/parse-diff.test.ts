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

  it("ignores plus-prefixed lines without diff hunk headers", () => {
    const code = `+console.log("not a diff");
+another line`;
    expect(parseDiffHighlights(code)).toEqual([]);
  });

  it("aligns highlights with rendered Shiki lines for unified diff sample", () => {
    const code = `@@ -1,3 +1,4 @@
-const old = true;
+const updated = true;
+export { updated };`;
    const h = parseDiffHighlights(code);
    expect(h).toContainEqual({ line: 2, type: "remove" });
    expect(h).toContainEqual({ line: 3, type: "add" });
    expect(h).toContainEqual({ line: 4, type: "add" });
  });
});
