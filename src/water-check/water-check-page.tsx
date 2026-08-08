import * as React from "react";
import { ArrowRightIcon, ArrowUpRightIcon, CheckInIcon, PlayIcon, PlusIcon, SparkleIcon } from "./water-check-icons";
import styles from "./water-check-page.module.css";

type WaterCheckPageProps = {
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

type StoreName = "App Store" | "Google Play";

const FEATURES = [
  {
    number: "01",
    eyebrow: "Planned input",
    title: "Planned scan or described-drink logging",
    copy: "Photograph a label or describe a drink in plain language. The future product is intended to turn either into a simple journal entry.",
    accent: "lime",
  },
  {
    number: "02",
    eyebrow: "Planned context",
    title: "Planned hydration and nutrient tracking",
    copy: "See estimated water, sugar, sodium, and other nutritional details together, so a drink has context beyond a single number.",
    accent: "aqua",
  },
  {
    number: "03",
    eyebrow: "Planned reflection",
    title: "Planned bloat check-ins",
    copy: "A quick later check-in is intended to help build a private record of how different days and drinks felt over time.",
    accent: "violet",
  },
  {
    number: "04",
    eyebrow: "Planned explanation",
    title: "Educational, approximate AI",
    copy: "Future explanations may surface possible patterns in a journal. They may be incomplete and cannot diagnose, treat, prevent, or establish a definitive cause.",
    accent: "coral",
  },
] as const;

const FAQS = [
  {
    question: "Is The Water Check available now?",
    answer:
      "Not yet. The Water Check is in development, and both store controls on this page are honest Coming Soon notices—not links to live listings.",
  },
  {
    question: "Will a possible pattern explain why bloating happened?",
    answer:
      "No. Bloating can have many causes. Any future AI or nutritional explanation is planned to be educational, approximate, and potentially incomplete; it will not diagnose a condition or prove causation.",
  },
  {
    question: "Does this page collect health information?",
    answer:
      "No. This Coming Soon page has no waitlist, account, scan upload, symptom form, or demographic questionnaire. Following Instagram is optional and opens Instagram only after an intentional click.",
  },
  {
    question: "Who is the future product for?",
    answer:
      "The planned experience is for adults age 18 and older who want a calmer way to reflect on drinks, hydration, and possible personal patterns.",
  },
] as const;

function StoreActions({ compact = false }: { compact?: boolean }) {
  const [availability, setAvailability] = React.useState<{ store: StoreName; repeated: boolean } | null>(null);

  const checkAvailability = (store: StoreName) => {
    setAvailability((current) => ({
      store,
      repeated: current?.store === store,
    }));
  };

  return (
    <div className={`${styles.storeArea} ${compact ? styles.storeAreaCompact : ""}`}>
      <fieldset className={styles.storeButtons}>
        <legend className={styles.srOnly}>Future app availability</legend>
        <button
          aria-label="App Store — Coming Soon"
          className={styles.storeButton}
          type="button"
          onClick={() => checkAvailability("App Store")}
        >
          <span className={styles.storeGlyph} aria-hidden="true">
            A
          </span>
          <span>
            <small>Coming Soon on the</small>
            <strong>App Store</strong>
          </span>
          <span className={styles.srOnly}> — Coming Soon</span>
        </button>
        <button
          aria-label="Google Play — Coming Soon"
          className={styles.storeButton}
          type="button"
          onClick={() => checkAvailability("Google Play")}
        >
          <span className={`${styles.storeGlyph} ${styles.playGlyph}`} aria-hidden="true">
            <PlayIcon className={styles.iconSvg} />
          </span>
          <span>
            <small>Coming Soon on</small>
            <strong>Google Play</strong>
          </span>
          <span className={styles.srOnly}> — Coming Soon</span>
        </button>
      </fieldset>
      <output className={styles.storeStatus} aria-live="polite" aria-atomic="true">
        {availability ? (
          <>
            {availability.store} is still coming soon. No store listing is live yet.
            {availability.repeated ? " Availability checked again." : ""}
          </>
        ) : (
          "No store listing is live yet. Choose either store for an availability update."
        )}
      </output>
    </div>
  );
}

export function WaterCheckPage({ onNavigate }: WaterCheckPageProps) {
  return (
    <div className={styles.pageFrame}>
      <main className={styles.page} aria-label="The Water Check Coming Soon">
        <section className={styles.hero} aria-label="Water Check introduction">
          <div className={styles.heroAtmosphere} aria-hidden="true">
            <span className={styles.heroOrbA} />
            <span className={styles.heroOrbB} />
            <span className={styles.heroGrid} />
          </div>

          <div className={styles.heroCopy}>
            <h1 className={styles.srOnly}>The Water Check</h1>
            <div className={styles.badges}>
              <span className={styles.comingSoon}>Coming Soon</span>
              <span className={styles.age}>For adults 18+</span>
            </div>
            <p className={styles.eyebrow}>A future drink + bloat journal</p>
            <h2 className={styles.heroTitle}>You’re not fat, just bloated.</h2>
            <p className={styles.tagline}>Snap. Track. Debloat.</p>
            <p className={styles.heroLimit}>
              Bloating can have many causes. The future product explores possible patterns in a personal drink journal—not body
              composition or a diagnosis.
            </p>
            <StoreActions />
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.brandHalo}>
              <div className={styles.brandGlass}>
                <span className={styles.brandGlint} aria-hidden="true" />
                <picture>
                  <source
                    type="image/webp"
                    srcSet="/brand/thewatercheck-liquid-glass-720.webp 720w, /brand/thewatercheck-liquid-glass-1080.webp 1080w"
                    sizes="(max-width: 900px) 88vw, 35rem"
                  />
                  <img
                    className={styles.brandImage}
                    src="/brand/thewatercheck-liquid-glass.png"
                    alt="The Water Check liquid-glass C emblem"
                    width="720"
                    height="720"
                    decoding="async"
                    fetchPriority="high"
                  />
                </picture>
              </div>
            </div>
            <div className={styles.visualNote}>
              <SparkleIcon className={styles.iconSvg} />
              <p>
                <strong>Notice, don’t diagnose.</strong> A quieter way to look back at the day.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.storySection} aria-labelledby="story-title">
          <div className={styles.sectionIntro}>
            <p className={styles.sectionKicker}>One drink. One check-in. More context.</p>
            <h2 id="story-title">The space between “I had this” and “I felt that.”</h2>
            <p>
              The planned experience is a journal, not a verdict. It is designed to place a drink log and a later feeling on the
              same gentle timeline.
            </p>
          </div>

          <section className={styles.journalStage} aria-label="A fictional drink journal">
            <div className={styles.journalTopline}>
              <span>Fictional example</span>
              <span>Thursday · personal journal</span>
            </div>
            <ol className={styles.timeline}>
              <li className={styles.timelineItem}>
                <div className={styles.timelineTime}>12:18</div>
                <article className={`${styles.timelineCard} ${styles.drinkCard}`}>
                  <span className={styles.timelineIcon} aria-hidden="true">
                    <PlusIcon className={styles.iconSvg} />
                  </span>
                  <div>
                    <p className={styles.timelineLabel}>Drink logged</p>
                    <h3>Sparkling lemon water</h3>
                    <p>Described in a few words · estimated details planned</p>
                  </div>
                  <span className={styles.timelinePill}>Saved to day</span>
                </article>
              </li>
              <li className={styles.timelineItem}>
                <div className={styles.timelineTime}>15:42</div>
                <article className={`${styles.timelineCard} ${styles.checkinCard}`}>
                  <span className={styles.timelineIcon} aria-hidden="true">
                    <CheckInIcon className={styles.iconSvg} />
                  </span>
                  <div>
                    <p className={styles.timelineLabel}>Later bloat check-in</p>
                    <h3>“A little uncomfortable”</h3>
                    <p>A fictional reflection recorded later—not a clinical measurement.</p>
                  </div>
                  <span className={styles.timelinePill}>Check-in</span>
                </article>
              </li>
              <li className={styles.timelineItem}>
                <div className={styles.timelineTime}>Over time</div>
                <article className={`${styles.timelineCard} ${styles.patternCard}`}>
                  <span className={styles.timelineIcon} aria-hidden="true">
                    <SparkleIcon className={styles.iconSvg} />
                  </span>
                  <div>
                    <p className={styles.timelineLabel}>Qualified possible pattern</p>
                    <h3>Carbonated drinks might be worth noticing.</h3>
                    <p>Educational and approximate. A possible pattern is not a cause, diagnosis, or medical conclusion.</p>
                  </div>
                  <span className={styles.timelinePill}>Explore, don’t conclude</span>
                </article>
              </li>
            </ol>
          </section>
        </section>

        <section className={styles.featuresSection} aria-labelledby="features-title">
          <div className={styles.sectionIntro}>
            <p className={styles.sectionKicker}>Planned, not live</p>
            <h2 id="features-title">A future toolkit for the everyday detective work.</h2>
            <p>
              Every capability below describes the direction in development. Nothing on this website performs these actions today.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {FEATURES.map((feature) => (
              <article className={`${styles.featureCard} ${styles[feature.accent]}`} key={feature.number}>
                <div className={styles.featureTopline}>
                  <span>{feature.eyebrow}</span>
                  <span>{feature.number}</span>
                </div>
                <div className={styles.featureArtifact} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
          </div>
          <aside className={styles.limitationBand} aria-label="Health and AI limitation">
            <span className={styles.limitMark} aria-hidden="true">
              i
            </span>
            <div>
              <h3>Context, never a conclusion.</h3>
              <p>
                Bloating can have many causes. Planned AI and nutritional estimates are educational, approximate, and may be
                incomplete. They do not determine body composition, diagnose or treat a condition, prevent illness, or establish
                definitive causation.
              </p>
              <a href="/thewatercheck/health-and-ai-disclaimer" onClick={onNavigate}>
                Read the Health &amp; AI Disclaimer <ArrowRightIcon className={styles.inlineIcon} />
              </a>
            </div>
          </aside>
        </section>

        <section className={styles.trustSection} aria-labelledby="trust-title">
          <div className={styles.trustCard}>
            <div className={styles.trustCopy}>
              <p className={styles.sectionKicker}>The quiet part is the point</p>
              <h2 id="trust-title">No form between curiosity and the story.</h2>
              <p>
                This Coming Soon page asks for no health information or email. There is no waitlist, account, scan upload, age
                check, demographic prompt, symptom entry, or AI conversation here.
              </p>
              <ul className={styles.trustFacts} aria-label="Current website boundaries">
                <li>No signup</li>
                <li>No health-data form</li>
                <li>No tracker or social embed</li>
              </ul>
            </div>
            <aside className={styles.trustSeal} aria-label="Current website: view only">
              <span>Current website</span>
              <strong>
                View
                <br />
                only
              </strong>
              <small>No submission</small>
            </aside>
          </div>
        </section>

        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className={styles.sectionIntro}>
            <p className={styles.sectionKicker}>Before the first sip</p>
            <h2 id="faq-title">A few clear answers.</h2>
          </div>
          <div className={styles.faqList}>
            {FAQS.map((faq, index) => (
              <details className={styles.faqItem} key={faq.question} open={index === 0}>
                <summary>
                  <span>{faq.question}</span>
                  <span className={styles.faqControl} aria-hidden="true">
                    ＋
                  </span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.finalSection} aria-labelledby="final-title">
          <div className={styles.finalGlow} aria-hidden="true" />
          <p className={styles.sectionKicker}>Coming Soon · 18+</p>
          <h2 id="final-title">The next check is not ready to download. It is ready to be built carefully.</h2>
          <p className={styles.finalCopy}>
            Choose a store for the honest status, or follow the optional Instagram link for launch updates. No release date is
            promised.
          </p>
          <StoreActions compact />
          <a
            className={styles.instagramLink}
            href="https://www.instagram.com/thewatercheck/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow on Instagram for launch updates <ArrowUpRightIcon className={styles.inlineIcon} />
          </a>
        </section>
      </main>
    </div>
  );
}
