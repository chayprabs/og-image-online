import type { SatoriFont } from "@social-render/core";

let cachedFonts: SatoriFont[] | null = null;

export async function loadOgFonts(): Promise<SatoriFont[]> {
  if (cachedFonts) return cachedFonts;
  const res = await fetch("/fonts/Inter-Regular.otf");
  if (!res.ok) throw new Error("Failed to load OG font");
  const data = await res.arrayBuffer();
  cachedFonts = [
    {
      name: "Inter",
      data,
      weight: 400,
      style: "normal",
    },
    {
      name: "Inter",
      data,
      weight: 700,
      style: "normal",
    },
  ];
  return cachedFonts;
}
