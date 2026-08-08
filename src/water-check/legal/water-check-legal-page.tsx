import type * as React from "react";
import type { WaterCheckLegalContent } from "./water-check-legal-content";
import styles from "./water-check-legal-page.module.css";

type WaterCheckLegalPageProps = {
  content: WaterCheckLegalContent;
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function WaterCheckLegalPage({ content, onNavigate }: WaterCheckLegalPageProps) {
  return (
    <main className={styles.page} aria-label={`${content.footerLabel} information`}>
      <article aria-label={content.title}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className={styles.intro}>{content.intro}</p>
          <p className={styles.effectiveDate}>Effective date: {content.effectiveDateLabel}</p>
        </header>

        <div className={styles.sections}>
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <aside className={styles.returnCard} aria-label="Return to product page">
          <a href="/thewatercheck" onClick={onNavigate}>
            Return to The Water Check
          </a>
        </aside>
      </article>
    </main>
  );
}
