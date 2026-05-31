import { Github, Globe } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const GITHUB_URL = "https://github.com/chayprabs/og-image-online";
const TWITTER_URL = "https://x.com/chayprabs";
const WEBSITE_URL = "https://www.chaitanyaprabuddha.com";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="text-lg font-semibold tracking-tight text-gray-900">
            SocialRender
          </Link>
          <nav className="flex items-center gap-4" aria-label="External links">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              title="GitHub repository"
            >
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 transition hover:text-gray-900"
              title="Twitter / X"
            >
              <XIcon />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 transition hover:text-gray-900"
              title="Personal website"
            >
              <Globe size={20} />
              <span className="sr-only">Website</span>
            </a>
          </nav>
        </div>
      </header>

      <div className="border-b border-[#e5e7eb] bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-6xl text-center text-sm leading-relaxed text-gray-600">
          <p>
            Generate Open Graph social cards and syntax-highlighted code screenshots in your
            browser.
          </p>
          <p className="mt-0.5">
            Themes, window chrome, line highlights, brand templates, and exact-DPI export — no
            upload required.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">{children}</main>

      <footer className="mt-auto border-t border-[#e5e7eb] bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl justify-center gap-6 text-sm text-gray-500">
          <Link to="/privacy" className="hover:text-gray-800">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-gray-800">
            Terms & Conditions
          </Link>
        </div>
      </footer>
    </div>
  );
}
