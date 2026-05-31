import satori from "satori";
import type { OgRenderOptions } from "./types.js";

const OG_FONT =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

type SatoriNode = {
  type: string;
  props: {
    style?: Record<string, string | number>;
    children?: string | SatoriNode | SatoriNode[];
  };
};

function buildOgElement(opts: OgRenderOptions): SatoriNode {
  const isPodcast = opts.templateId === "podcast";
  const isTalk = opts.templateId === "talk-slide";

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: isPodcast ? "80px" : "64px",
        background: isTalk
          ? `linear-gradient(135deg, ${opts.accentColor} 0%, #0f172a 100%)`
          : `linear-gradient(160deg, #ffffff 0%, #f1f5f9 55%, ${opts.accentColor}22 100%)`,
        color: isTalk ? "#ffffff" : "#0f172a",
        fontFamily: OG_FONT,
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              fontSize: isPodcast ? 28 : 24,
              fontWeight: 600,
              color: isTalk ? "#e2e8f0" : opts.accentColor,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            },
            children: opts.templateId.replace(/-/g, " "),
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: isPodcast ? 56 : 64,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: "90%",
            },
            children: opts.title,
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: 32,
              marginTop: 24,
              opacity: 0.85,
              maxWidth: "85%",
            },
            children: opts.subtitle,
          },
        },
      ],
    },
  };
}

export async function renderOG(opts: OgRenderOptions): Promise<string> {
  const svg = await satori(buildOgElement(opts) as Parameters<typeof satori>[0], {
    width: opts.width,
    height: opts.height,
    fonts: [],
  });
  return svg;
}

export async function renderOGTemplate(
  templateId: string,
  vars: Record<string, string>,
  width: number,
  height: number,
): Promise<string> {
  return renderOG({
    templateId,
    title: vars.title ?? "Title",
    subtitle: vars.subtitle ?? "Subtitle",
    accentColor: vars.accentColor ?? "#2563eb",
    width,
    height,
  });
}
