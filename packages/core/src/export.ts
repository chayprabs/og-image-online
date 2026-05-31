import type { ExportDpi, ExportFormat } from "./types.js";

export interface RasterizeInput {
  svgOrHtml: string;
  width: number;
  height: number;
  format: ExportFormat;
  dpi: ExportDpi;
  isSvg?: boolean;
}

export function scaleDimensions(
  width: number,
  height: number,
  dpi: ExportDpi,
): { width: number; height: number } {
  return { width: width * dpi, height: height * dpi };
}

export async function svgToBlob(svg: string): Promise<Blob> {
  return new Blob([svg], { type: "image/svg+xml" });
}

export async function canvasFromSvg(
  svg: string,
  width: number,
  height: number,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D unavailable");

  const img = new Image();
  const url = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
  );

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to rasterize SVG"));
    };
    img.src = url;
  });

  return canvas;
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
  quality = 0.92,
): Promise<Blob> {
  const mime =
    format === "png"
      ? "image/png"
      : format === "jpeg"
        ? "image/jpeg"
        : format === "webp"
          ? "image/webp"
          : format === "avif"
            ? "image/avif"
            : "image/png";

  if (format === "avif" && !canvas.toDataURL("image/avif").startsWith("data:image/avif")) {
    return canvasToBlob(canvas, "webp", quality);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))),
      mime,
      quality,
    );
  });
}

export async function exportRaster(
  svg: string,
  width: number,
  height: number,
  format: ExportFormat,
  dpi: ExportDpi,
): Promise<Blob> {
  if (format === "svg") return svgToBlob(svg);

  const scaled = scaleDimensions(width, height, dpi);
  const canvas = await canvasFromSvg(svg, scaled.width, scaled.height);
  return canvasToBlob(canvas, format);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
