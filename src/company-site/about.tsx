import { ContactForm } from "./contact-form";
import { GoldenEggButton } from "./golden-egg-button";
import styles from "./style.module.css";

type AboutPageProps = {
  onOpenArtWorld: () => void;
};

export function AboutPage({ onOpenArtWorld }: AboutPageProps) {
  return (
    <main className={styles.aboutMain}>
      <section className={styles.aboutLayout}>
        <p className={styles.kicker}>Our story</p>
        <h1>Why Expected End?</h1>
        <div className={styles.aboutCopy}>
          <p className={styles.aboutLead}>Expected End is the home for ideas built with purpose.</p>
          <p>It brings software, productivity tools, digital experiences, and communities under one company so each project can grow without losing the reason it began.</p>
          <p>This page will eventually hold the full story—how the name was chosen, what came before, and where the company is going. For now, the work tells the first chapter.</p>
        </div>
      </section>
      <ContactForm />
      <GoldenEggButton onActivate={onOpenArtWorld} />
    </main>
  );
}
