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
import { toCanvas } from "html-to-image";
import { loadOgFonts } from "./fonts";

export async function updateCodePreview(opts: CodeRenderOptions): Promise<string> {
  return renderCodeToHtml(opts);
}

export async function updateOgPreview(opts: OgRenderOptions): Promise<string> {
  const fonts = await loadOgFonts();
  const label = BRAND_TEMPLATES.find((t) => t.id === opts.templateId)?.label;
  return renderOG(opts, fonts, label);
}

export function buildOgOptionsFromFields(
  templateId: string,
  title: string,
  subtitle: string,
  accentColor: string,
  width: number,
  height: number,
  logoDataUrl?: string,
): OgRenderOptions {
  return buildOgOptionsFromTemplate(
    {
      templateId,
      variables: { title, subtitle, accentColor },
    },
    width,
    height,
    logoDataUrl,
  );
}

export async function updateOgFromFields(
  templateId: string,
  title: string,
  subtitle: string,
  accentColor: string,
  width: number,
  height: number,
  logoDataUrl?: string,
): Promise<string> {
  const opts = buildOgOptionsFromFields(
    templateId,
    title,
    subtitle,
    accentColor,
    width,
    height,
    logoDataUrl,
  );
  return updateOgPreview(opts);
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

async function rasterizeElement(
  target: HTMLElement,
  format: ExportFormat,
  dpi: ExportDpi,
): Promise<{ blob: Blob; ext: string }> {
  const canvas = await toCanvas(target, {
    pixelRatio: dpi,
    cacheBust: true,
  });

  const rasterFormat = format === "avif" ? "webp" : format;
  const mime =
    rasterFormat === "png"
      ? "image/png"
      : rasterFormat === "jpeg"
        ? "image/jpeg"
        : rasterFormat === "webp"
          ? "image/webp"
          : "image/png";

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))),
      mime,
      0.92,
    );
  });

  let ext = rasterFormat === "jpeg" ? "jpg" : rasterFormat;
  if (format === "avif") ext = blob.type.includes("avif") ? "avif" : "webp";
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

  if (format === "svg") {
    const w = target.scrollWidth;
    const h = target.scrollHeight;
    const headStyles = doc.querySelector("style")?.textContent ?? "";
    const serialized = new XMLSerializer().serializeToString(target);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs><style type="text/css"><![CDATA[${headStyles}]]></style></defs>
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">${serialized}</div>
      </foreignObject>
    </svg>`;
    document.body.removeChild(host);
    return { blob: await svgToBlob(svg), ext: "svg" };
  }

  const result = await rasterizeElement(target, format, dpi);
  document.body.removeChild(host);
  return result;
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
