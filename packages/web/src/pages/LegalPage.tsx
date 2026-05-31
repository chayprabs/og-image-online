import DocumentTitle from "../components/DocumentTitle";
import LegalDocument from "../components/LegalDocument";
import {
  LICENSE_SECTIONS,
  PRIVACY_SECTIONS,
  TERMS_SECTIONS,
} from "../content/legal";

export default function LegalPage({
  kind,
}: {
  kind: "privacy" | "terms" | "license";
}) {
  if (kind === "privacy") {
    return (
      <>
        <DocumentTitle title="Privacy Policy | SocialRender" />
        <LegalDocument title="Privacy Policy" sections={PRIVACY_SECTIONS} />
      </>
    );
  }

  if (kind === "license") {
    return (
      <>
        <DocumentTitle title="License | SocialRender" />
        <LegalDocument title="License & Legal Notice" sections={LICENSE_SECTIONS} />
        <div className="prose prose-sm mx-auto mt-4 max-w-3xl text-gray-700">
          <p className="text-sm">
            Full MIT License text:{" "}
            <a
              href="https://github.com/chayprabs/og-image-online/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LICENSE file on GitHub
            </a>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <DocumentTitle title="Terms & Conditions | SocialRender" />
      <LegalDocument title="Terms & Conditions" sections={TERMS_SECTIONS} />
    </>
  );
}
