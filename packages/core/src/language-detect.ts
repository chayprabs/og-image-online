const EXTENSION_MAP: Record<string, string> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  py: "python",
  rs: "rust",
  go: "go",
  java: "java",
  rb: "ruby",
  php: "php",
  swift: "swift",
  kt: "kotlin",
  cs: "csharp",
  cpp: "cpp",
  c: "c",
  html: "html",
  css: "css",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  md: "markdown",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
};

const PATTERNS: [RegExp, string][] = [
 [/^\s*import .+ from ['"]/m, "typescript"],
 [/^\s*export default function/m, "tsx"],
 [/^\s*def \w+\(/m, "python"],
 [/^\s*fn \w+\(/m, "rust"],
 [/^\s*func \w+\(/m, "go"],
 [/^\s*package main/m, "go"],
 [/^\s*public class /m, "java"],
 [/^\s*#include </m, "cpp"],
 [/^\s*SELECT .+ FROM /im, "sql"],
 [/^\s*<!DOCTYPE html>/im, "html"],
];

export function detectLanguage(code: string, hint?: string): string {
  if (hint && hint !== "auto" && hint !== "plaintext") return hint;
  for (const [pattern, lang] of PATTERNS) {
    if (pattern.test(code)) return lang;
  }
  if (/^\s*[{[]/.test(code)) return "json";
  if (/^\s*</.test(code)) return "xml";
  return "plaintext";
}

export function languageFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_MAP[ext] ?? "plaintext";
}
