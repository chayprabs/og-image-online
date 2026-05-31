import { describe, expect, it } from "vitest";
import { buildOgOptionsFromTemplate, parseOgTemplateJson } from "./og-templates.js";

describe("og-templates", () => {
  it("parses template JSON and builds options", () => {
    const json = parseOgTemplateJson(
      JSON.stringify({
        templateId: "talk-slide",
        variables: { title: "Hello", subtitle: "World", accentColor: "#ff0000" },
      }),
    );
    const opts = buildOgOptionsFromTemplate(json, 1200, 630);
    expect(opts.title).toBe("Hello");
    expect(opts.templateId).toBe("talk-slide");
    expect(opts.width).toBe(1200);
  });
});
