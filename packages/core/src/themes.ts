export const BUILTIN_THEMES = [
  "github-dark",
  "github-light",
  "one-dark-pro",
  "dracula",
  "nord",
  "monokai",
  "vitesse-dark",
  "vitesse-light",
  "tokyo-night",
  "catppuccin-mocha",
] as const;

export type BuiltinTheme = (typeof BUILTIN_THEMES)[number];
