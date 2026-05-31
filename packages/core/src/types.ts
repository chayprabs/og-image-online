export type ExportFormat = "svg" | "png" | "jpeg" | "webp" | "avif";
export type ExportDpi = 1 | 2 | 3;
export type WindowChrome = "macos" | "windows" | "none";
export type AppMode = "code" | "og";

export interface SizePreset {
  id: string;
  label: string;
  width: number;
  height: number;
}

export interface Template {
  kind: "code" | "og";
  spec: Record<string, unknown>;
  variables: Record<string, unknown>;
}

export interface CodeRenderOptions {
  code: string;
  language: string;
  theme: string;
  windowChrome: WindowChrome;
  showLineNumbers: boolean;
  lineHighlights: number[];
  diffHighlights: { line: number; type: "add" | "remove" }[];
  padding: number;
  shadow: boolean;
  gradient: boolean;
  fontFamily: string;
  fontSize: number;
  ligatures: boolean;
  width: number;
  height: number;
}

export interface OgRenderOptions {
  title: string;
  subtitle: string;
  accentColor: string;
  width: number;
  height: number;
  templateId: string;
}

export interface ExportOptions {
  format: ExportFormat;
  dpi: ExportDpi;
  width: number;
  height: number;
}
