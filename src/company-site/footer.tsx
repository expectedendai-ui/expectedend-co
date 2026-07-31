import * as React from "react";
import { CONTACT_HREF } from "./content";
import styles from "./style.module.css";

type FooterProps = {
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <a className={styles.footerWordmark} href="/" onClick={onNavigate}>Expected End</a>
        <nav className={styles.footerLinks} aria-label="Footer navigation">
          <a href="/" onClick={onNavigate}>Home</a>
          <a href="/about" onClick={onNavigate}>About</a>
          <a href="/terms" onClick={onNavigate}>Terms of Service</a>
          <a href="/privacy" onClick={onNavigate}>Privacy Statement</a>
          <a href="/accessibility" onClick={onNavigate}>Accessibility</a>
          <a href={CONTACT_HREF}>Contact</a>
        </nav>
      </div>
      <div className={styles.footerBottom}>
        <p>© 2026 EXPECTED END LLC. All rights reserved.</p>
        <p className={styles.blessing}>Jesus loves you.</p>
      </div>
    </footer>
  );
}
