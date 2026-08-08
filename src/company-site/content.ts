export const CONTACT_HREF = "/about#contact";

// The privacy disclosure changed when fonts became self-hosted. Renewed owner
// approval is required before the production release gate can turn green.
export const PUBLIC_CONTENT_APPROVED = false;

export const PROJECTS = [
  {
    name: "MyBibleLens",
    category: "Christianity app",
    destination: {
      kind: "external",
      href: "https://mybiblelens.us/",
      actionLabel: "Visit app",
    },
    bioHref: "https://mybiblelens.us/legal.html#about",
    image: "/brand/mybiblelens.png",
    artVariant: "mybiblelens",
    titleClassName: "mblTitle",
  },
  {
    name: "The Water Check",
    category: "Health app · Coming Soon",
    destination: {
      kind: "internal",
      href: "/thewatercheck",
      actionLabel: "Visit product page",
    },
    bioHref: null,
    image: "/brand/thewatercheck.png",
    artVariant: "watercheck",
    titleClassName: "",
  },
] as const;

export const SERVICES = [
  ["01", "Apps", "Useful, thoughtful products designed around real people.", "Building an app or software idea"],
  ["02", "Websites", "Distinct digital homes that feel clear, alive, and welcoming.", "Website or digital experience"],
  ["03", "AI systems", "Practical intelligence that helps ideas and teams move forward.", "AI system or productivity tool"],
  ["04", "Creative", "Identity, direction, and experiences with meaning at the center.", "Creative direction or design"],
] as const;
