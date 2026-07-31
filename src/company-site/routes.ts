export type CompanyRouteKey = "home" | "about" | "terms" | "privacy" | "accessibility" | "not-found";

export type CompanyRoute = {
  key: CompanyRouteKey;
  path: string;
  title: string;
  description: string;
};

const ROUTES: CompanyRoute[] = [
  {
    key: "home",
    path: "/",
    title: "Expected End — Purpose, built beautifully",
    description: "Expected End creates thoughtful software, productivity tools, digital experiences, and communities.",
  },
  {
    key: "about",
    path: "/about",
    title: "About — Expected End",
    description: "Denzel Rigaud's founder story, the mission behind Expected End, and the projects built from faith and purpose.",
  },
  {
    key: "terms",
    path: "/terms",
    title: "Website Terms of Use — Expected End",
    description: "Terms governing use of the Expected End website.",
  },
  {
    key: "privacy",
    path: "/privacy",
    title: "Privacy Statement — Expected End",
    description: "How Expected End handles information on this website.",
  },
  {
    key: "accessibility",
    path: "/accessibility",
    title: "Accessibility — Expected End",
    description: "Expected End's commitment to an accessible website experience.",
  },
];

const NOT_FOUND_ROUTE: CompanyRoute = {
  key: "not-found",
  path: "/404",
  title: "Page not found — Expected End",
  description: "The requested Expected End page could not be found.",
};

const normalizePath = (pathname: string) => {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "") || "/";
};

export const getRoute = (pathname: string): CompanyRoute => {
  const path = normalizePath(pathname);
  return ROUTES.find((route) => route.path === path) ?? NOT_FOUND_ROUTE;
};

export const getRouteMetadata = (pathname: string) => {
  const route = getRoute(pathname);
  const canonicalPath = route.key === "not-found" ? "/" : route.path;
  return {
    title: route.title,
    description: route.description,
    canonical: `https://expectedend.co${canonicalPath === "/" ? "/" : canonicalPath}`,
  };
};

export const isInternalHref = (href: string, origin = window.location.origin) => {
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  try {
    const url = new URL(href, origin);
    return url.origin === origin;
  } catch {
    return false;
  }
};
