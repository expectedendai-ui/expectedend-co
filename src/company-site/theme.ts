export type SiteTheme = "blue" | "white";

export const DEFAULT_SITE_THEME: SiteTheme = "blue";
export const SITE_THEME_STORAGE_KEY = "expectedend-site-theme";

const isSiteTheme = (value: string | null): value is SiteTheme => value === "blue" || value === "white";

export const readSiteTheme = (): SiteTheme => {
  try {
    const saved = window.localStorage.getItem(SITE_THEME_STORAGE_KEY);
    return isSiteTheme(saved) ? saved : DEFAULT_SITE_THEME;
  } catch {
    return DEFAULT_SITE_THEME;
  }
};

export const writeSiteTheme = (theme: SiteTheme) => {
  try {
    window.localStorage.setItem(SITE_THEME_STORAGE_KEY, theme);
  } catch {
    // The selected theme still applies for this page view when storage is unavailable.
  }
};

