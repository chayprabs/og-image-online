import { Link } from "react-router-dom";
import Playground from "../components/Playground";

const SEO_COPY: Record<string, { title: string; description: string }> = {
  "og-image-generator": {
    title: "OG Image Generator",
    description:
      "Create Open Graph images for blogs, products, and social posts with live preview and exact-DPI export.",
  },
  "code-screenshot": {
    title: "Code Screenshot Maker",
    description:
      "Turn syntax-highlighted code into beautiful shareable images with themes and window chrome.",
  },
  "twitter-card-maker": {
    title: "Twitter Card Maker",
    description: "Design Twitter/X card images at the recommended 1200×675 size.",
  },
  "linkedin-preview-image": {
    title: "LinkedIn Preview Image",
    description: "Generate LinkedIn-optimized preview images at 1200×627.",
  },
  "code-to-image": {
    title: "Code to Image",
    description: "Paste code, pick a theme, and export PNG, WebP, or SVG in your browser.",
  },
};

export default function SeoLandingPage({ slug }: { slug: string }) {
  const copy = SEO_COPY[slug];
  return (
    <div>
      <div className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-center">
        <h1 className="text-lg font-semibold text-gray-900">{copy.title}</h1>
        <p className="mt-1 text-sm text-gray-600">{copy.description}</p>
        <Link to="/" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
          ← Back to home
        </Link>
      </div>
      <Playground />
    </div>
  );
}
