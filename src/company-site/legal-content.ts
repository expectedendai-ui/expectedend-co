export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

export const LEGAL_CONTENT = {
  terms: {
    eyebrow: "Company information",
    title: "Terms of Service",
    intro: "These terms govern your use of the Expected End website. By using this site, you agree to use it lawfully and respectfully.",
    sections: [
      { heading: "About this website", paragraphs: ["This website shares information about Expected End LLC, its projects, and selected services. Content is provided for general informational purposes and may change as the company grows."] },
      { heading: "Intellectual property", paragraphs: ["Unless otherwise noted, the words, visuals, branding, and original materials on this site belong to Expected End LLC and may not be copied or republished without permission."] },
      { heading: "Third-party destinations", paragraphs: ["Links to projects, social platforms, and other websites lead to services operated by third parties. Their own terms and policies apply when you visit them."] },
      { heading: "Changes and contact", paragraphs: ["We may update these terms when the website or its services change. Questions about these terms can be sent through the Contact link below."] },
    ],
  },
  privacy: {
    eyebrow: "Company information",
    title: "Privacy Statement",
    intro: "Expected End aims to collect as little personal information as this public website needs.",
    sections: [
      { heading: "Information this site uses", paragraphs: ["This website currently has no public accounts, payment flow, or contact form. Your selected blue or white theme is stored in your browser so the site can remember your preference."] },
      { heading: "Technical information", paragraphs: ["Our website host may process standard technical information, such as IP address, browser type, requested pages, and security logs, to deliver and protect the site."] },
      { heading: "Third-party services", paragraphs: ["The site may request fonts from Google Fonts and links to external projects and social platforms. Those providers handle information under their own privacy policies when you use their services."] },
      { heading: "Your choices", paragraphs: ["You can clear the saved theme through your browser storage settings. Privacy questions may be sent through the Contact link below."] },
    ],
  },
  accessibility: {
    eyebrow: "Company information",
    title: "Accessibility",
    intro: "Expected End wants its website and digital experiences to be welcoming and usable for as many people as possible.",
    sections: [
      { heading: "Our approach", paragraphs: ["We work toward clear structure, keyboard access, readable contrast, meaningful labels, responsive layouts, and reduced-motion support across this site."] },
      { heading: "Ongoing work", paragraphs: ["Accessibility is an ongoing practice. As the site changes, we will continue to test its core paths and improve barriers we find."] },
      { heading: "Feedback", paragraphs: ["If something on this website is difficult to use or access, please tell us through the Contact link below. Include the page and the problem you encountered so we can investigate."] },
    ],
  },
} satisfies Record<"terms" | "privacy" | "accessibility", LegalPageContent>;
