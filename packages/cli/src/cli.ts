#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { renderCodeToHtml } from "@social-render/core";

const args = process.argv.slice(2);
const fileIdx = args.indexOf("-f");
const outIdx = args.indexOf("-o");
const langIdx = args.indexOf("-l");

if (args.includes("--help") || args.includes("-h")) {
  console.log(`social-render — export code screenshots from the CLI

Usage:
  social-render -f input.ts -o output.html [-l typescript]

Options:
  -f   Input source file
  -o   Output HTML file
  -l   Language (default: typescript)
`);
  process.exit(0);
}

const input = fileIdx >= 0 ? args[fileIdx + 1] : undefined;
const output = outIdx >= 0 ? args[outIdx + 1] : undefined;
const language = langIdx >= 0 ? args[langIdx + 1] : "typescript";

if (!input || !output) {
  console.error("Error: -f <input> and -o <output> are required");
  process.exit(1);
}

const { readFile } = await import("node:fs/promises");
const code = await readFile(input, "utf8");
const html = await renderCodeToHtml({
  code,
  language,
  theme: "github-dark",
  windowChrome: "macos",
  showLineNumbers: true,
  lineHighlights: [],
  diffHighlights: [],
  padding: 24,
  shadow: true,
  gradient: true,
  fontFamily: "monospace",
  fontSize: 14,
  ligatures: true,
  width: 800,
  height: 500,
});

await writeFile(output, html);
console.log(`Wrote ${output}`);
