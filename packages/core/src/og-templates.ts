import type { OgRenderOptions } from "./types.js";

export interface OgTemplateSpec {
  id: string;
  label: string;
  description: string;
  defaults: {
    title: string;
    subtitle: string;
    accentColor: string;
  };
}

export const OG_TEMPLATE_SPECS: OgTemplateSpec[] = [
  {
    id: "blog-header",
    label: "Blog Header",
    description: "Clean blog post OG card",
    defaults: {
      title: "Your Blog Post Title",
      subtitle: "A concise subtitle for readers",
      accentColor: "#2563eb",
    },
  },
  {
    id: "talk-slide",
    label: "Talk Title Slide",
    description: "Conference talk cover image",
    defaults: {
      title: "Building Better OG Images",
      subtitle: "DevConf 2026 · Your Name",
      accentColor: "#7c3aed",
    },
  },
  {
    id: "podcast",
    label: "Podcast Cover",
    description: "Episode artwork style",
    defaults: {
      title: "Episode 42: Social Cards",
      subtitle: "Weekly developer podcast",
      accentColor: "#059669",
    },
  },
  {
    id: "app-feature",
    label: "App Feature",
    description: "Product feature announcement",
    defaults: {
      title: "Introducing SocialRender",
      subtitle: "OG images & code screenshots in your browser",
      accentColor: "#dc2626",
    },
  },
];

export const DEFAULT_OG_TEMPLATE_JSON = JSON.stringify(
  {
    templateId: "blog-header",
    variables: {
      title: "Your Blog Post Title",
      subtitle: "A concise subtitle for readers",
      accentColor: "#2563eb",
    },
  },
  null,
  2,
);

export interface OgTemplateJson {
  templateId?: string;
  variables?: Record<string, string>;
}

export function parseOgTemplateJson(raw: string): OgTemplateJson {
  const parsed = JSON.parse(raw) as OgTemplateJson;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Template must be a JSON object");
  }
  return parsed;
}

export function buildOgOptionsFromTemplate(
  json: OgTemplateJson,
  width: number,
  height: number,
  logoDataUrl?: string,
): OgRenderOptions {
  const spec = OG_TEMPLATE_SPECS.find((t) => t.id === json.templateId) ?? OG_TEMPLATE_SPECS[0];
  const vars = json.variables ?? {};
  return {
    templateId: json.templateId ?? spec.id,
    title: vars.title ?? spec.defaults.title,
    subtitle: vars.subtitle ?? spec.defaults.subtitle,
    accentColor: vars.accentColor ?? spec.defaults.accentColor,
    width,
    height,
    logoDataUrl,
  };
}
