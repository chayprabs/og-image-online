import {
  canvasFromSvg,
  canvasToBlob,
  downloadBlob,
  exportRaster,
  renderCodeToHtml,
  renderOG,
  svgToBlob,
  type CodeRenderOptions,
  type ExportDpi,
  type ExportFormat,
  type OgRenderOptions,
} from "@social-render/core";

export async function updateCodePreview(opts: CodeRenderOptions): Promise<string> {
  return renderCodeToHtml(opts);
}

export async function updateOgPreview(opts: OgRenderOptions): Promise<string> {
  return renderOG(opts);
}

export async function exportPreview(
  svgOrHtml: string,
  width: number,
  height: number,
  format: ExportFormat,
  dpi: ExportDpi,
  isOg: boolean,
): Promise<void> {
  let svg = svgOrHtml;
  if (!isOg && !svgOrHtml.trimStart().startsWith("<svg")) {
    const wrapper = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">${svgOrHtml}</div>
      </foreignObject>
    </svg>`;
    svg = wrapper;
  }

  if (format === "svg") {
    const blob = await svgToBlob(svg);
    downloadBlob(blob, `social-render.${format}`);
    return;
  }

  const blob = await exportRaster(svg, width, height, format, dpi);
  downloadBlob(blob, `social-render@${dpi}x.${format}`);
}

export async function htmlToPngBlob(html: string, width: number, height: number): Promise<Blob> {
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;left:-9999px;width:0;height:0;border:0";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(html);
  doc.close();

  await new Promise((r) => setTimeout(r, 150));

  const body = doc.body;
  const w = Math.max(body.scrollWidth, width);
  const h = Math.max(body.scrollHeight, height);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, w, h);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml">${body.innerHTML}</div>
    </foreignObject>
  </svg>`;

  document.body.removeChild(iframe);
  const rasterCanvas = await canvasFromSvg(svg, w, h);
  return canvasToBlob(rasterCanvas, "png");
}
