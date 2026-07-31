import * as React from "react";
import styles from "./style.module.css";
import type { SiteTheme } from "./theme";

type NavigationProps = {
  isHome: boolean;
  theme: SiteTheme;
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onThemeChange: (theme: SiteTheme) => void;
};

export function Navigation({ isHome, theme, onNavigate, onThemeChange }: NavigationProps) {
  const sectionRoot = isHome ? "" : "/";

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <div className={styles.navLinks}>
        <a className={styles.sectionLink} href={`${sectionRoot}#projects`} onClick={onNavigate}>Projects</a>
        <a className={styles.sectionLink} href={`${sectionRoot}#mission`} onClick={onNavigate}>Mission</a>
        <a className={styles.sectionLink} href={`${sectionRoot}#services`} onClick={onNavigate}>Services</a>
        <a href="/about" onClick={onNavigate}>About</a>
      </div>
      <fieldset className={styles.theme} aria-label="Color theme">
        {(["white", "blue"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={theme === option}
            className={theme === option ? styles.themeActive : ""}
            onClick={() => onThemeChange(option)}
          >
            {option === "white" ? "White" : "Blue"}
          </button>
        ))}
      </fieldset>
    </nav>
  );
}
