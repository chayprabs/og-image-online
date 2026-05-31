import DocumentTitle from "../components/DocumentTitle";

export default function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  if (kind === "privacy") {
    return (
      <article className="prose prose-sm mx-auto max-w-3xl text-gray-700">
        <DocumentTitle title="Privacy Policy | SocialRender" />
        <h1 className="text-2xl font-semibold text-gray-900">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: May 31, 2026</p>
        <p>
          SocialRender (&quot;we&quot;, &quot;the tool&quot;) is a browser-only application. Your
          code, templates, and generated images are processed locally in your web browser. We do not
          operate a server that receives, stores, or analyzes your source code or exported images.
        </p>
        <h2 className="mt-6 text-lg font-medium">Data we do not collect</h2>
        <ul className="list-disc pl-5">
          <li>Uploaded or pasted source code</li>
          <li>Generated image contents</li>
          <li>Account credentials (no accounts are required)</li>
        </ul>
        <h2 className="mt-6 text-lg font-medium">Local storage</h2>
        <p>
          The app may store preferences in your browser&apos;s local storage. You can clear this
          data via your browser settings at any time.
        </p>
        <h2 className="mt-6 text-lg font-medium">Third-party links</h2>
        <p>
          The header may link to GitHub, social profiles, or personal websites. Those sites have
          their own privacy policies.
        </p>
        <h2 className="mt-6 text-lg font-medium">Contact</h2>
        <p>
          Questions: open an issue at{" "}
          <a
            href="https://github.com/chayprabs/og-image-online"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            github.com/chayprabs/og-image-online
          </a>
          .
        </p>
      </article>
    );
  }

  return (
    <article className="prose prose-sm mx-auto max-w-3xl text-gray-700">
      <DocumentTitle title="Terms & Conditions | SocialRender" />
      <h1 className="text-2xl font-semibold text-gray-900">Terms & Conditions</h1>
      <p className="text-sm text-gray-500">Last updated: May 31, 2026</p>
      <p>
        By using SocialRender you agree to these terms. The software is provided under the MIT
        License. Use at your own risk.
      </p>
      <h2 className="mt-6 text-lg font-medium">No warranty</h2>
      <p>
        THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND. We do not
        guarantee uninterrupted availability, accuracy of exports, or fitness for a particular
        purpose.
      </p>
      <h2 className="mt-6 text-lg font-medium">Your responsibility</h2>
      <ul className="list-disc pl-5">
        <li>You are responsible for content you create and share.</li>
        <li>You must have rights to any fonts, logos, or code you use.</li>
        <li>You must comply with applicable laws and platform rules (e.g. social networks).</li>
      </ul>
      <h2 className="mt-6 text-lg font-medium">Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, the authors and contributors shall not be liable
        for any indirect, incidental, special, consequential, or punitive damages arising from use
        of this tool.
      </p>
      <h2 className="mt-6 text-lg font-medium">Changes</h2>
      <p>We may update these terms. Continued use after changes constitutes acceptance.</p>
    </article>
  );
}
