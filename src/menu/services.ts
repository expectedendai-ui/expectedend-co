// Shared by the menu and the intake form.
export const INSTAGRAM = "https://www.instagram.com/smiledenzel/";
// Meta's official deep link straight into a DM thread with the account.
export const IG_DM = "https://ig.me/m/smiledenzel";

export type Service = {
  code: string; // internal order code (intake form pre-fill)
  icon: string; // emoji shown big on the album card
  example: string; // plain-English "e.g." line under the icon
  name: string;
  hook: string; // how real people ask for it
  tags: string[];
  price: string;
};

export const SERVICES: Service[] = [
  {
    code: "W1",
    icon: "🌐",
    example: "e.g. your barbershop, bookable online by tonight",
    name: "Websites & Landing Pages",
    hook: "“I need a website for my business.”",
    tags: ["custom design", "SEO", "booking pages", "portfolios"],
    price: "starting at $750",
  },
  {
    code: "A2",
    icon: "📱",
    example: "e.g. your idea, live on the App Store",
    name: "Apps — iOS & Android",
    hook: "“Turn my idea into an app.”",
    tags: ["App Store", "TestFlight", "full-stack", "push notifications"],
    price: "starting at $3,000",
  },
  {
    code: "S3",
    icon: "🛍️",
    example: "e.g. your clothing drop, selling while you sleep",
    name: "Shopify & E-Commerce",
    hook: "“Set up my online store.”",
    tags: ["product drops", "checkout", "Stripe", "subscriptions"],
    price: "starting at $1,200",
  },
  {
    code: "J4",
    icon: "🤖",
    example: "e.g. an AI receptionist texting customers back 24/7",
    name: "JARVIS — AI Automation",
    hook: "Your company texts back. By itself.",
    tags: ["AI receptionist", "AI through your phone", "AI spokesman", "24/7 replies"],
    price: "starting at $500/mo",
  },
  {
    code: "H5",
    icon: "🔗",
    example: "e.g. a Stripe sale → QuickBooks invoice, automatically",
    name: "Integrations & Webhooks",
    hook: "“Make my apps talk to each other.”",
    tags: ["bookings → SMS", "Stripe → QuickBooks", "CRM hookups", "auto-invoices"],
    price: "starting at $400",
  },
  {
    code: "C6",
    icon: "🎨",
    example: "e.g. daily flyers & posts for your brand or church",
    name: "Canva Art & Content",
    hook: "Scroll-stopping visuals, daily.",
    tags: ["logos", "flyers", "social posts", "motion design"],
    price: "starting at $150",
  },
  {
    code: "M7",
    icon: "🎓",
    example: "e.g. 1-on-1 sessions until you ship your first build",
    name: "Mentorship",
    hook: "Learn to build all of this yourself.",
    tags: ["1-on-1", "brick by brick", "no gatekeeping", "zero → shipped"],
    price: "starting at $99/session",
  },
];
