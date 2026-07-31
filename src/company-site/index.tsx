import * as React from "react";
import { getRoute, getRouteMetadata, isInternalHref } from "./routes";
import styles from "./style.module.css";
import { readSiteTheme, type SiteTheme, writeSiteTheme } from "./theme";

type CompanySiteProps = {
  leaving: boolean;
  onOpenArtWorld: () => void;
};

const updateDocumentMetadata = (pathname: string) => {
  const metadata = getRouteMetadata(pathname);
  document.title = metadata.title;

  let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!description) {
    description = document.createElement("meta");
    description.name = "description";
    document.head.append(description);
  }
  description.content = metadata.description;

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = metadata.canonical;
};

const scrollToHash = (hash: string) => {
  if (!hash) {
    window.scrollTo({ top: 0 });
    return;
  }
  window.requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" }));
};

export function CompanySite({ leaving, onOpenArtWorld }: CompanySiteProps) {
  const [route, setRoute] = React.useState(() => getRoute(window.location.pathname));
  const [theme, setTheme] = React.useState<SiteTheme>(readSiteTheme);

  React.useEffect(() => {
    updateDocumentMetadata(window.location.pathname);
  }, [route]);

  React.useEffect(() => {
    const onPopState = () => {
      setRoute(getRoute(window.location.pathname));
      scrollToHash(window.location.hash);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const selectTheme = (nextTheme: SiteTheme) => {
    setTheme(nextTheme);
    writeSiteTheme(nextTheme);
  };

  const onNavigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const href = event.currentTarget.getAttribute("href");
    if (!href || !isInternalHref(href)) return;
    event.preventDefault();
    const url = new URL(href, window.location.href);
    window.history.pushState({}, "", `${url.pathname}${url.hash}`);
    setRoute(getRoute(url.pathname));
    scrollToHash(url.hash);
  };

  return (
    <div className={`${styles.site} ${leaving ? styles.leaving : ""}`} data-site-theme={theme}>
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.navLinks}>
          <a href="/#projects" onClick={onNavigate}>Projects</a>
          <a href="/#mission" onClick={onNavigate}>Mission</a>
          <a href="/#services" onClick={onNavigate}>Services</a>
          <a href="/about" onClick={onNavigate}>About</a>
        </div>
        <div className={styles.theme} aria-label="Color theme">
          {(["white", "blue"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={theme === option}
              className={theme === option ? styles.themeActive : ""}
              onClick={() => selectTheme(option)}
            >
              {option === "white" ? "White" : "Blue"}
            </button>
          ))}
        </div>
      </nav>
      <main className={styles.placeholder}>
        <h1>{route.title}</h1>
        {route.key === "about" && (
          <button type="button" onClick={onOpenArtWorld}>Open art world</button>
        )}
      </main>
    </div>
  );
}

