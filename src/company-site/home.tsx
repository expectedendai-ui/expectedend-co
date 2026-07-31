import * as React from "react";
import { BioDialog } from "./bio-dialog";
import { PROJECTS, SERVICES } from "./content";
import styles from "./style.module.css";

export function HomePage() {
  const [activeBio, setActiveBio] = React.useState<string | null>(null);

  return (
    <main className={styles.home}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroInner}>
          <p className={styles.kicker}>Expected End</p>
          <h1 id="hero-title" className={styles.heroTitle}>Purpose, built <em>beautifully.</em></h1>
          <p className={styles.heroStatement}>
            We create thoughtful software, productivity tools, digital experiences, and communities that <em>bring people closer to God in exciting and easy ways!</em>
          </p>
          <a className={styles.primaryAction} href="#projects">Meet our projects <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className={`${styles.section} ${styles.projectsSection}`} id="projects" aria-labelledby="projects-title">
        <h2 className={styles.srOnly} id="projects-title">Projects</h2>
        <div className={styles.projectGrid}>
          {PROJECTS.map((project) => (
            <article className={styles.project} key={project.name}>
              <a
                className={styles.projectArt}
                data-art-variant={project.artVariant}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${project.name}`}
              >
                <img src={project.image} alt="" width="640" height="640" loading="lazy" decoding="async" />
              </a>
              <div className={styles.projectText}>
                <p className={styles.status}>{project.category}</p>
                <h3 className={project.titleClassName ? styles[project.titleClassName] : ""}>{project.name}</h3>
                <div className={styles.projectActions}>
                  <button type="button" aria-label={`Bio for ${project.name}`} onClick={() => setActiveBio(project.name)}>Bio</button>
                  <a href={project.href} target="_blank" rel="noreferrer">{project.name === "The Water Check" ? "Visit Instagram" : "Visit app"} <span aria-hidden="true">↗</span></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.missionSection}`} id="mission" aria-labelledby="mission-title">
        <div className={styles.missionCard}>
          <span className={styles.missionMark} aria-hidden="true">✦</span>
          <div>
            <p className={styles.kicker}>Our mission</p>
            <h2 id="mission-title">Ideas can feel meaningful <em>and</em> easy to enter.</h2>
            <p>We build technology with care—so useful products can feel human, beautiful, and genuinely welcoming.</p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.servicesSection}`} id="services" aria-labelledby="services-title">
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>Selected services</p>
          <h2 id="services-title">You dream it — <em>we build it</em></h2>
          <p>Our products come first. When the fit is right, we bring the same thoughtfulness to selected work for others.</p>
        </div>
        <div className={styles.services}>
          {SERVICES.map(([number, title, description]) => (
            <article className={styles.service} key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      {activeBio && <BioDialog projectName={activeBio} onClose={() => setActiveBio(null)} />}
    </main>
  );
}
