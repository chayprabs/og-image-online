# SocialRender (`og-image-online`)

Generate **Open Graph social cards** and **syntax-highlighted code screenshots** in your browser. Themes, window chrome, line highlights, brand templates, JSON template editor, font/logo upload, and exact-DPI export — your code never leaves your device.

![SocialRender preview](docs/screenshot.svg)

## Features

| Area | Capabilities |
|------|----------------|
| **Code Image** | Shiki highlighting (150+ languages, lazy-loaded), auto-detect language, 10+ themes + custom JSON theme, macOS/Windows/none chrome, shadows, gradients, line numbers, line & diff highlights, font upload, ligatures |
| **OG Image** | Live Satori preview, title/subtitle/accent variables, logo upload, brand templates, JSON template editor with Apply/Sync |
| **Export** | SVG, PNG, JPEG, WebP, AVIF at 1×/2×/3× DPI |
| **Presets** | Open Graph 1200×630, square, HD, Twitter, LinkedIn |
| **Share** | URL hash encodes full state |
| **Privacy** | Browser-only after load; optional local preferences (clear anytime) |
| **PWA** | Installable progressive web app |

## Quick start

Requirements: **Node.js 22+**, **pnpm 9+**.

```bash
git clone https://github.com/chayprabs/og-image-online.git
cd og-image-online
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production build

```bash
pnpm build
pnpm --filter @social-render/web preview
```

Serve `packages/web/dist` on Cloudflare Pages, Netlify, nginx, etc.

### Docker

```bash
docker compose up --build
```

Serves the static build at [http://localhost:8080](http://localhost:8080).

### CLI

```bash
pnpm --filter @social-render/cli build
node packages/cli/dist/cli.js -f example.ts -o out.html -l typescript
```

## Project structure

```
packages/
  core/   # Shiki + Satori rendering, export, templates, diff parser
  web/    # Vite + React playground (PWA)
  cli/    # Optional HTML export from terminal
```

## SEO landing pages

- `/og-image-generator`
- `/code-screenshot`
- `/twitter-card-maker`
- `/linkedin-preview-image`
- `/code-to-image`

## Library API

```ts
import {
  renderCodeToHtml,
  renderOG,
  parseDiffHighlights,
  buildOgOptionsFromTemplate,
} from "@social-render/core";
```

## Topics

`og-image` · `open-graph` · `social-card` · `code-screenshot` · `shiki` · `carbon` · `code-image` · `social-media` · `twitter-card` · `linkedin-preview` · `brand-templates` · `marketing-images` · `syntax-highlighting` · `online-tool` · `og-image-generator`

## Legal

| Document | Location |
| -------- | -------- |
| Privacy Policy | [/privacy](packages/web/src/content/legal.ts) on site · [legal/PRIVACY.md](legal/PRIVACY.md) |
| Terms & Conditions | [/terms](packages/web/src/content/legal.ts) on site · [legal/TERMS.md](legal/TERMS.md) |
| MIT License (code) | [LICENSE](LICENSE) |
| Third-party notices | [NOTICE](NOTICE) |

Use of the hosted Service is subject to the Terms and Privacy Policy. The MIT
License governs the source code; it does not replace website terms.

## Security

Report vulnerabilities via [GitHub Security Advisories](https://github.com/chayprabs/og-image-online/security/advisories/new). See [SECURITY.md](SECURITY.md) and [SECURITY.txt](SECURITY.txt).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
