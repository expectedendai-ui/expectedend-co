export const CONTACT_HREF = "/about#contact";

export const PUBLIC_CONTENT_APPROVED = true;

export const PROJECTS = [
  {
    name: "MyBibleLens",
    category: "Christianity app",
    href: "https://mybiblelens.us/",
    image: "/brand/mybiblelens.png",
    artVariant: "mybiblelens",
    titleClassName: "mblTitle",
  },
  {
    name: "The Water Check",
    category: "Instagram community",
    href: "https://www.instagram.com/thewatercheck/",
    image: "/brand/thewatercheck.png",
    artVariant: "watercheck",
    titleClassName: "",
  },
] as const;

export const SERVICES = [
  ["01", "Apps", "Useful, thoughtful products designed around real people."],
  ["02", "Websites", "Distinct digital homes that feel clear, alive, and welcoming."],
  ["03", "AI systems", "Practical intelligence that helps ideas and teams move forward."],
  ["04", "Creative", "Identity, direction, and experiences with meaning at the center."],
] as const;
