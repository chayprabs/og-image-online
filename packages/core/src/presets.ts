import type { SizePreset } from "./types.js";

export const SIZE_PRESETS: SizePreset[] = [
  { id: "og", label: "Open Graph (1200×630)", width: 1200, height: 630 },
  { id: "square", label: "Square (1080×1080)", width: 1080, height: 1080 },
  { id: "hd", label: "HD (1920×1080)", width: 1920, height: 1080 },
  { id: "twitter", label: "Twitter Card", width: 1200, height: 675 },
  { id: "linkedin", label: "LinkedIn", width: 1200, height: 627 },
];

export const CODE_SIZE_PRESETS: SizePreset[] = [
  { id: "auto", label: "Auto fit", width: 800, height: 500 },
  { id: "og", label: "1200×630", width: 1200, height: 630 },
  { id: "twitter", label: "Twitter", width: 1200, height: 675 },
];
