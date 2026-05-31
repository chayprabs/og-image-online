/** Legal copy for SocialRender — last reviewed May 31, 2026. */

export const LEGAL_META = {
  lastUpdated: "May 31, 2026",
  operatorName: "Chaitanya Prabuddha",
  productName: "SocialRender",
  repoUrl: "https://github.com/chayprabs/og-image-online",
  securityUrl: "https://github.com/chayprabs/og-image-online/security/advisories/new",
  personalSiteUrl: "https://www.chaitanyaprabuddha.com",
} as const;

export type LegalSection = {
  id: string;
  title: string;
  body: string[];
  list?: string[];
};

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "intro",
    title: "1. Introduction",
    body: [
      `This Privacy Policy explains how ${LEGAL_META.productName} (“Service”, “we”, “us”) handles information when you use the website and open-source software operated by ${LEGAL_META.operatorName} (“Operator”).`,
      "The Service is designed to process your code, templates, and images locally in your web browser. We do not operate application servers that receive, store, or analyze your source code or exported images.",
      "By using the Service, you acknowledge this Privacy Policy. If you do not agree, do not use the Service.",
    ],
  },
  {
    id: "controller",
    title: "2. Data controller",
    body: [
      `For purposes of applicable privacy laws (including the EU/UK GDPR), the data controller is ${LEGAL_META.operatorName}, contactable via the GitHub repository linked at the bottom of this page.`,
    ],
  },
  {
    id: "collect",
    title: "3. Information we do not collect",
    list: [
      "Source code you paste or type into the editor",
      "Images or files you generate, export, or copy",
      "Account credentials (the Service does not require registration)",
      "Payment information (the Service is provided free of charge)",
      "Precise geolocation or device advertising identifiers",
    ],
    body: [
      "We do not sell personal information and do not use cross-site tracking for advertising.",
    ],
  },
  {
    id: "local",
    title: "4. Browser storage and on-device processing",
    body: [
      "The Service may store preferences (for example theme, language, and editor settings) in your browser’s local storage. This data remains on your device unless you clear it.",
      "Share links may encode state in the URL fragment (#). Fragments are not sent to our servers when you load static pages, but anyone with the link can decode them. Do not share links containing confidential code.",
      "You can clear stored preferences using the in-app control or your browser settings.",
    ],
    list: [
      "Legal basis (EEA/UK): where required, we rely on your consent or legitimate interests in providing a functional local tool, depending on your jurisdiction.",
      "Retention: data in local storage persists until you delete it.",
    ],
  },
  {
    id: "hosting",
    title: "5. Hosting and technical logs",
    body: [
      "If you access the Service over the public internet, your browser will connect to a hosting or content-delivery provider to download static files (HTML, JavaScript, fonts, and assets). That provider may process standard connection metadata (such as IP address, user agent, and request time) according to its own privacy policy.",
      "We do not combine those logs with your editor content because content is not transmitted to us for processing.",
    ],
  },
  {
    id: "third-party",
    title: "6. Third-party links and open-source components",
    body: [
      "The Service header may link to third-party sites (for example GitHub, X, or a personal website). Those sites have separate privacy practices.",
      "The Service bundles open-source libraries (for example syntax highlighters and fonts). Their licenses are described in the repository NOTICE and LICENSE files.",
    ],
  },
  {
    id: "rights",
    title: "7. Your privacy rights",
    body: [
      "Depending on where you live, you may have rights to access, correct, delete, restrict, or object to processing of personal information, and to lodge a complaint with a supervisory authority.",
      "Because we do not maintain accounts or server-side copies of your editor content, the primary way to exercise deletion rights is to clear browser storage and avoid sharing sensitive URL fragments.",
      "California residents: we do not “sell” or “share” personal information as defined under the CCPA/CPRA. We do not use sensitive personal information for purposes requiring an opt-out.",
    ],
  },
  {
    id: "children",
    title: "8. Children",
    body: [
      "The Service is not directed to children under 13 (or the minimum age required in your country). If you are under the required age, do not use the Service.",
      "If you believe a child has provided personal information to us through channels we control, contact us via the repository and we will take reasonable steps to delete it.",
    ],
  },
  {
    id: "intl",
    title: "9. International users",
    body: [
      "If you access the Service from outside the country where the Operator is located, you understand that local laws may differ. Where required, you consent to the practices described in this policy.",
    ],
  },
  {
    id: "changes",
    title: "10. Changes",
    body: [
      `We may update this Privacy Policy from time to time. The “Last updated” date at the top indicates the latest revision. Material changes will be posted on this page. Continued use after changes constitutes acceptance where permitted by law.`,
    ],
  },
  {
    id: "contact",
    title: "11. Contact",
    body: [
      "Privacy questions or requests: open an issue or security advisory on the GitHub repository listed below. We will respond when reasonably practicable.",
    ],
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    title: "1. Agreement to terms",
    body: [
      `These Terms & Conditions (“Terms”) govern your access to and use of ${LEGAL_META.productName} (the “Service”), including the website, documentation, and related open-source software published by ${LEGAL_META.operatorName} (“Operator”, “we”, “us”).`,
      "By accessing or using the Service, you agree to these Terms and our Privacy Policy. If you do not agree, you must not use the Service.",
      "If you use the Service on behalf of an organization, you represent that you have authority to bind that organization, and “you” includes the organization.",
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    body: [
      "You must be at least 13 years old (or the minimum digital-consent age in your jurisdiction, if higher) and able to form a binding contract.",
      "You may not use the Service if you are barred under applicable export-control, sanctions, or anti-corruption laws.",
    ],
  },
  {
    id: "service",
    title: "3. Description of the Service",
    body: [
      "The Service helps you generate Open Graph images and syntax-highlighted code screenshots in your browser. Features may change, be suspended, or be discontinued at any time without liability.",
      "The Service is provided for general informational and creative purposes only. It is not legal, financial, security, or professional advice.",
    ],
  },
  {
    id: "oss",
    title: "4. Open-source software",
    body: [
      "Source code for the Service is licensed under the MIT License unless otherwise noted in the repository. Your use of the source code is governed by the MIT License in addition to these Terms when you download, fork, or redistribute the software.",
      "Use of the hosted website is governed by these Terms even when the underlying code is open source.",
    ],
  },
  {
    id: "content",
    title: "5. Your content and responsibilities",
    list: [
      "You retain ownership of content you create. We do not claim ownership of your code or images.",
      "You are solely responsible for the content you input, generate, export, or share, including compliance with copyright, trademark, privacy, and platform rules (social networks, employers, etc.).",
      "You represent that you have all rights, licenses, and consents needed for fonts, logos, code, and images you use.",
      "You will not use the Service for unlawful, harmful, fraudulent, harassing, defamatory, or infringing activities.",
      "You will not attempt to disrupt, reverse engineer, scrape, overload, or circumvent security of the Service or its hosting.",
    ],
    body: [],
  },
  {
    id: "dmca",
    title: "6. Copyright complaints",
    body: [
      "If you believe content available through the Service infringes your copyright, notify us via the GitHub repository with sufficient detail to identify the work and the allegedly infringing use. We may remove or disable access to materials we host if required by law.",
      "Repeat infringers may be blocked from project channels where we have control.",
    ],
  },
  {
    id: "ip",
    title: "7. Our intellectual property",
    body: [
      `The Service name, branding, documentation, and original materials are owned by the Operator or licensors and protected by applicable intellectual-property laws. Except for rights expressly granted under the MIT License for source code, no license is granted to our trademarks or brand assets.`,
    ],
  },
  {
    id: "warranty",
    title: "8. Disclaimer of warranties",
    body: [
      'THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE”, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.',
      "We do not warrant that the Service will be uninterrupted, error-free, secure, or that exports will meet any platform’s requirements (dimensions, file size, or metadata).",
      "Some jurisdictions do not allow exclusion of implied warranties; in those jurisdictions, exclusions apply to the maximum extent permitted by law.",
    ],
  },
  {
    id: "liability",
    title: "9. Limitation of liability",
    body: [
      "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE OPERATOR, CONTRIBUTORS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS INTERRUPTION, ARISING OUT OF OR RELATED TO THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER THEORY, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
      "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US FOR THE SERVICE IN THE TWELVE (12) MONTHS BEFORE THE CLAIM (TYPICALLY ZERO) OR (B) ONE HUNDRED U.S. DOLLARS (USD $100).",
      "Nothing in these Terms limits liability where limitation is prohibited by law (for example death or personal injury caused by negligence, or fraud).",
    ],
  },
  {
    id: "indemnity",
    title: "10. Indemnification",
    body: [
      "You agree to defend, indemnify, and hold harmless the Operator, contributors, and licensors from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys’ fees) arising out of or related to: (a) your use of the Service; (b) your content; (c) your violation of these Terms; or (d) your violation of any law or third-party rights.",
    ],
  },
  {
    id: "release",
    title: "11. Release",
    body: [
      "To the fullest extent permitted by law, you release the Operator and contributors from claims, demands, and damages of every kind, known and unknown, arising out of or in any way connected with disputes you have with third parties relating to content you create or share using the Service.",
    ],
  },
  {
    id: "export",
    title: "12. Export and sanctions",
    body: [
      "You may not use or export the Service except as authorized by applicable law. You represent that you are not located in, under the control of, or a national or resident of any country or person subject to comprehensive sanctions where use would be prohibited.",
    ],
  },
  {
    id: "disputes",
    title: "13. Governing law and disputes",
    body: [
      "These Terms are governed by the laws of India, without regard to conflict-of-law rules that would apply another jurisdiction’s laws.",
      "Except where prohibited by mandatory consumer-protection laws in your country of residence, you agree that exclusive jurisdiction and venue for disputes arising out of these Terms or the Service shall lie in the courts located in Bengaluru, Karnataka, India, and you consent to personal jurisdiction there.",
      "If you are a consumer in the European Union or United Kingdom, you may also have mandatory rights to bring claims in your country of residence; nothing in these Terms affects those non-waivable rights.",
      "CLASS ACTION WAIVER: TO THE EXTENT PERMITTED BY LAW, DISPUTES MUST BE BROUGHT ON AN INDIVIDUAL BASIS AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, OR REPRESENTATIVE PROCEEDING.",
    ],
  },
  {
    id: "termination",
    title: "14. Termination",
    body: [
      "We may suspend or terminate access to the Service at any time, with or without notice, for any reason, including violation of these Terms.",
      "Sections that by their nature should survive (including warranties disclaimer, limitation of liability, indemnification, and governing law) survive termination.",
    ],
  },
  {
    id: "changes-terms",
    title: "15. Changes",
    body: [
      "We may modify these Terms at any time by posting an updated version. Your continued use after the effective date constitutes acceptance where permitted by law. If you do not agree, stop using the Service.",
    ],
  },
  {
    id: "misc",
    title: "16. General",
    list: [
      "Entire agreement: These Terms and the Privacy Policy are the entire agreement regarding the Service.",
      "Severability: If any provision is unenforceable, the remainder stays in effect.",
      "No waiver: Failure to enforce a provision is not a waiver.",
      "Assignment: You may not assign these Terms without consent; we may assign them in connection with a reorganization or transfer.",
      "Language: The English version controls if translated versions conflict.",
    ],
    body: [
      "These Terms do not create a partnership, joint venture, employment, or agency relationship.",
    ],
  },
  {
    id: "contact-terms",
    title: "17. Contact",
    body: [
      "Questions about these Terms: contact via the GitHub repository below.",
    ],
  },
];

export const LICENSE_SECTIONS: LegalSection[] = [
  {
    id: "overview",
    title: "Software license",
    body: [
      `The ${LEGAL_META.productName} source code in the public repository is licensed under the MIT License (see LICENSE in the repository root).`,
      "The MIT License permits use, modification, and distribution subject to its conditions, including preservation of copyright and license notices.",
    ],
  },
  {
    id: "website",
    title: "Website use",
    body: [
      "Use of the hosted website, brand name, and documentation is also governed by the Terms & Conditions and Privacy Policy, in addition to the MIT License for code.",
    ],
  },
  {
    id: "third-party-lic",
    title: "Third-party components",
    body: [
      "The Service includes third-party open-source software (for example Shiki, React, and fonts). Those components are licensed under their respective licenses. See NOTICE in the repository for attributions.",
    ],
  },
  {
    id: "no-legal-advice",
    title: "Not legal advice",
    body: [
      "These documents are provided for transparency and are not a substitute for professional legal advice. Laws vary by jurisdiction; consult qualified counsel for your situation.",
    ],
  },
];
