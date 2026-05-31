import type { LegalSection } from "../content/legal";
import { LEGAL_META } from "../content/legal";

export default function LegalDocument({
  title,
  sections,
}: {
  title: string;
  sections: LegalSection[];
}) {
  return (
    <article className="prose prose-sm mx-auto max-w-3xl text-gray-700">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500">Last updated: {LEGAL_META.lastUpdated}</p>
      {sections.map((section) => (
        <section key={section.id} className="mt-6">
          <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
          {section.body.map((paragraph, i) => (
            <p key={`${section.id}-p-${i}`} className="mt-2">
              {paragraph}
            </p>
          ))}
          {section.list?.length ? (
            <ul className="mt-2 list-disc pl-5">
              {section.list.map((item, i) => (
                <li key={`${section.id}-li-${i}`}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      <p className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        Operator: {LEGAL_META.operatorName} ·{" "}
        <a
          href={LEGAL_META.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {LEGAL_META.repoUrl.replace("https://", "")}
        </a>
      </p>
    </article>
  );
}
