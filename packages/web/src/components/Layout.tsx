import { Globe } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const GITHUB_URL = "https://github.com/chayprabs/og-image-online";
const TWITTER_URL = "https://x.com/chayprabs";
const WEBSITE_URL = "https://www.chaitanyaprabuddha.com";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

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
              <GitHubIcon />
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
          <Link to="/license" className="hover:text-gray-800">
            License
          </Link>
        </div>
      </footer>
    </div>
  );
}
