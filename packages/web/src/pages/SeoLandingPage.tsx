import type { AppMode } from "@social-render/core";
import { Link } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";
import Playground from "../components/Playground";

const SEO_COPY: Record<
  string,
  { title: string; description: string; mode: AppMode; sizePresetId: string }
> = {
  "og-image-generator": {
    title: "OG Image Generator",
    description:
      "Create Open Graph images for blogs, products, and social posts with live preview and exact-DPI export.",
    mode: "og",
    sizePresetId: "og",
  },
  "code-screenshot": {
    title: "Code Screenshot Maker",
    description:
      "Turn syntax-highlighted code into beautiful shareable images with themes and window chrome.",
    mode: "code",
    sizePresetId: "auto",
  },
  "twitter-card-maker": {
    title: "Twitter Card Maker",
    description: "Design Twitter/X card images at the recommended 1200×675 size.",
    mode: "og",
    sizePresetId: "twitter",
  },
  "linkedin-preview-image": {
    title: "LinkedIn Preview Image",
    description: "Generate LinkedIn-optimized preview images at 1200×627.",
    mode: "og",
    sizePresetId: "linkedin",
  },
  "code-to-image": {
    title: "Code to Image",
    description: "Paste code, pick a theme, and export PNG, WebP, or SVG in your browser.",
    mode: "code",
    sizePresetId: "auto",
  },
};

export default function SeoLandingPage({ slug }: { slug: string }) {
  const copy = SEO_COPY[slug] ?? SEO_COPY["og-image-generator"];
  return (
    <div>
      <DocumentTitle title={`${copy.title} | SocialRender`} description={copy.description} />
      <div className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-center">
        <h1 className="text-lg font-semibold text-gray-900">{copy.title}</h1>
        <p className="mt-1 text-sm text-gray-600">{copy.description}</p>
        <Link to="/" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
          ← Back to home
        </Link>
      </div>
      <Playground initialMode={copy.mode} initialSizePresetId={copy.sizePresetId} />
    </div>
  );
}
