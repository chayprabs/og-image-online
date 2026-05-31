import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderOG } from "./render-og.js";

const fontPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../web/public/fonts/Inter-Regular.ttf",
);

describe("renderOG", () => {
  it("renders SVG with loaded font", async () => {
    const data = readFileSync(fontPath);
    const fonts = [{ name: "Inter", data, weight: 400 as const, style: "normal" as const }];
    const svg = await renderOG(
      {
        title: "Test",
        subtitle: "Subtitle",
        accentColor: "#2563eb",
        templateId: "blog-header",
        width: 400,
        height: 200,
      },
      fonts,
      "Blog",
    );
    expect(svg).toContain("<svg");
    expect(svg.length).toBeGreaterThan(500);
  });
});
