import {
  BRAND_TEMPLATES,
  buildOgOptionsFromTemplate,
  downloadBlob,
  exportRaster,
  parseOgTemplateJson,
  renderCodeToHtml,
  renderOG,
  svgToBlob,
  type CodeRenderOptions,
  type ExportDpi,
  type ExportFormat,
  type OgRenderOptions,
} from "@social-render/core";
import { toBlob } from "html-to-image";
import { loadOgFonts } from "./fonts";

export async function updateCodePreview(opts: CodeRenderOptions): Promise<string> {
  return renderCodeToHtml(opts);
}

export async function updateOgPreview(opts: OgRenderOptions): Promise<string> {
  const fonts = await loadOgFonts();
  const label = BRAND_TEMPLATES.find((t) => t.id === opts.templateId)?.label;
  return renderOG(opts, fonts, label);
}

export async function updateOgFromTemplateJson(
  templateJson: string,
  width: number,
  height: number,
  logoDataUrl?: string,
): Promise<string> {
  const parsed = parseOgTemplateJson(templateJson);
  const opts = buildOgOptionsFromTemplate(parsed, width, height, logoDataUrl);
  return updateOgPreview(opts);
}

export async function exportOgPreview(
  svg: string,
  width: number,
  height: number,
  format: ExportFormat,
  dpi: ExportDpi,
): Promise<{ blob: Blob; ext: string }> {
  if (format === "svg") {
    return { blob: await svgToBlob(svg), ext: "svg" };
  }
  const blob = await exportRaster(svg, width, height, format, dpi);
  let ext = format === "jpeg" ? "jpg" : format;
  if (format === "avif" && blob.type.includes("webp")) ext = "webp";
  return { blob, ext };
}

export async function exportCodeFromHtml(
  html: string,
  format: ExportFormat,
  dpi: ExportDpi,
): Promise<{ blob: Blob; ext: string }> {
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;left:-9999px;top:0;z-index:-1";
  const iframe = document.createElement("iframe");
  iframe.style.border = "0";
  iframe.width = "1200";
  iframe.height = "800";
  host.appendChild(iframe);
  document.body.appendChild(host);

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(html);
  doc.close();
  await new Promise((r) => setTimeout(r, 200));

  const target = doc.getElementById("export-root") ?? doc.body;
  const pixelRatio = dpi;

  if (format === "svg") {
    const w = target.scrollWidth;
    const h = target.scrollHeight;
    const serialized = new XMLSerializer().serializeToString(target);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${serialized}</div></foreignObject></svg>`;
    document.body.removeChild(host);
    return { blob: await svgToBlob(svg), ext: "svg" };
  }

  const mime =
    format === "png"
      ? "image/png"
      : format === "jpeg"
        ? "image/jpeg"
        : format === "webp"
          ? "image/webp"
          : "image/png";

  const blob = await toBlob(target, {
    pixelRatio,
    cacheBust: true,
    skipFonts: false,
    type: mime,
    quality: 0.92,
  });

  document.body.removeChild(host);
  if (!blob) throw new Error("Export failed");

  let ext = format === "jpeg" ? "jpg" : format;
  if (format === "avif") ext = blob.type.includes("avif") ? "avif" : "webp";
  return { blob, ext };
}

export async function downloadExport(
  blob: Blob,
  format: ExportFormat,
  dpi: ExportDpi,
  ext: string,
): Promise<void> {
  const suffix = format === "svg" ? "" : `@${dpi}x`;
  downloadBlob(blob, `social-render${suffix}.${ext}`);
}

export async function copyBlobToClipboard(blob: Blob): Promise<void> {
  if (!navigator.clipboard?.write) throw new Error("Clipboard API unavailable");
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
}
