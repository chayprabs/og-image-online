import satori from "satori";
import type { OgRenderOptions } from "./types.js";

export const OG_FONT_FAMILY = "Inter";

export type SatoriFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
};

type SatoriNode = {
  type: string;
  props: Record<string, unknown>;
};

function buildOgElement(opts: OgRenderOptions, label: string): SatoriNode {
  const isPodcast = opts.templateId === "podcast";
  const isTalk = opts.templateId === "talk-slide";
  const isApp = opts.templateId === "app-feature";
  const isBlog = opts.templateId === "blog-header";

  const background = isTalk
    ? `linear-gradient(135deg, ${opts.accentColor} 0%, #0f172a 100%)`
    : isPodcast
      ? `radial-gradient(circle at 20% 20%, ${opts.accentColor}44, #0f172a 70%)`
      : isApp
        ? `linear-gradient(120deg, #ffffff 30%, ${opts.accentColor}33 100%)`
        : isBlog
          ? `linear-gradient(180deg, #ffffff 0%, #f8fafc 60%, ${opts.accentColor}18 100%)`
          : `linear-gradient(160deg, #ffffff 0%, #f1f5f9 55%, ${opts.accentColor}22 100%)`;

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
        background,
        color: isTalk || isPodcast ? "#ffffff" : "#0f172a",
        fontFamily: OG_FONT_FAMILY,
      },
      children: [
        ...(opts.logoDataUrl
          ? [
              {
                type: "img",
                props: {
                  src: opts.logoDataUrl,
                  width: 72,
                  height: 72,
                  style: { marginBottom: 24, borderRadius: 12, objectFit: "cover" as const },
                },
              },
            ]
          : []),
        {
          type: "div",
          props: {
            style: {
              fontSize: isPodcast ? 28 : 24,
              fontWeight: 600,
              color: isTalk || isPodcast ? "#e2e8f0" : opts.accentColor,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            },
            children: label,
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

export async function renderOG(
  opts: OgRenderOptions,
  fonts: SatoriFont[],
  templateLabel?: string,
): Promise<string> {
  const label = templateLabel ?? opts.templateId.replace(/-/g, " ");
  const svg = await satori(buildOgElement(opts, label) as Parameters<typeof satori>[0], {
    width: opts.width,
    height: opts.height,
    fonts,
  });
  return svg;
}

export async function renderOGTemplate(
  templateId: string,
  vars: Record<string, string>,
  width: number,
  height: number,
  fonts: SatoriFont[],
): Promise<string> {
  return renderOG(
    {
      templateId,
      title: vars.title ?? vars.defaultTitle ?? "Title",
      subtitle: vars.subtitle ?? vars.defaultSubtitle ?? "Subtitle",
      accentColor: vars.accentColor ?? "#2563eb",
      width,
      height,
    },
    fonts,
    vars.label,
  );
}
