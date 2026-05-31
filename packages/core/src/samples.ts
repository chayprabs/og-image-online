export interface CodeSample {
  id: string;
  label: string;
  language: string;
  code: string;
}

export interface BrandTemplate {
  id: string;
  label: string;
  description: string;
  defaultTitle: string;
  defaultSubtitle: string;
  accentColor: string;
}

export const CODE_SAMPLES: CodeSample[] = [
  {
    id: "ts",
    label: "TypeScript",
    language: "typescript",
    code: `export async function renderCode(opts: RenderOpts): Promise<Blob> {
  const html = await highlight(opts.code, opts.language);
  return rasterize(html, opts);
}`,
  },
  {
    id: "rust",
    label: "Rust",
    language: "rust",
    code: `fn main() {
    let message = "Hello, SocialRender!";
    println!("{}", message);
}`,
  },
  {
    id: "python",
    label: "Python",
    language: "python",
    code: `def fibonacci(n: int) -> list[int]:
    a, b = 0, 1
    return [a := b + (b := a) for _ in range(n)]`,
  },
  {
    id: "go",
    label: "Go",
    language: "go",
    code: `package main

import "fmt"

func main() {
    fmt.Println("SocialRender")
}`,
  },
  {
    id: "jsx",
    label: "JSX",
    language: "jsx",
    code: `export function Card({ title }) {
  return (
    <div className="card">
      <h1>{title}</h1>
    </div>
  );
}`,
  },
  {
    id: "sql",
    label: "SQL",
    language: "sql",
    code: `SELECT id, title, created_at
FROM posts
WHERE published = true
ORDER BY created_at DESC
LIMIT 10;`,
  },
  {
    id: "bash",
    label: "Bash",
    language: "bash",
    code: `#!/usr/bin/env bash
set -euo pipefail
pnpm install && pnpm build && pnpm preview`,
  },
  {
    id: "json",
    label: "JSON",
    language: "json",
    code: `{
  "name": "social-render",
  "version": "1.0.0",
  "private": true
}`,
  },
  {
    id: "css",
    label: "CSS",
    language: "css",
    code: `.preview {
  display: flex;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 12px;
}`,
  },
  {
    id: "diff",
    label: "Diff",
    language: "diff",
    code: `@@ -1,3 +1,4 @@
-const old = true;
+const updated = true;
+export { updated };`,
  },
];

/** Re-export for backward compatibility — prefer OG_TEMPLATE_SPECS from og-templates.ts */
export const BRAND_TEMPLATES: BrandTemplate[] = [
  {
    id: "blog-header",
    label: "Blog Header",
    description: "Clean blog post OG card",
    defaultTitle: "Your Blog Post Title",
    defaultSubtitle: "A concise subtitle for readers",
    accentColor: "#2563eb",
  },
  {
    id: "talk-slide",
    label: "Talk Title Slide",
    description: "Conference talk cover image",
    defaultTitle: "Building Better OG Images",
    defaultSubtitle: "DevConf 2026 · Your Name",
    accentColor: "#7c3aed",
  },
  {
    id: "podcast",
    label: "Podcast Cover",
    description: "Episode artwork style",
    defaultTitle: "Episode 42: Social Cards",
    defaultSubtitle: "Weekly developer podcast",
    accentColor: "#059669",
  },
  {
    id: "app-feature",
    label: "App Feature",
    description: "Product feature announcement",
    defaultTitle: "Introducing SocialRender",
    defaultSubtitle: "OG images & code screenshots in your browser",
    accentColor: "#dc2626",
  },
];
