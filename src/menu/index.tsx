import * as React from "react";
import { Coverflow } from "./carousel";
import { IntakeModal } from "./intake";
import { INSTAGRAM } from "./services";
import styles from "./style.module.css";

// THE MENU — front-of-house services page shown after the binary loader.
// Codrops "Text Distortion Effects" energy (big tiles, giant codes that
// liquefy with scroll speed) rebuilt with SVG turbulence instead of
// Blotter.js so it runs fast on phones. The art world (song gate → infinite
// canvas) stays hidden behind the 🥚 easter egg in the bottom-right corner.

const RECEIPTS = [
  "plumbing companies",
  "clothing brands",
  "churches",
  "barbershops",
  "startups",
  "webhook plumbing",
  "Stripe → QuickBooks",
  "bookings → SMS",
  "Shopify → fulfillment",
  "AI receptionists",
  "landing pages in days",
];

export function ServiceMenu({ leaving, onOpen }: { leaving: boolean; onOpen: () => void }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const dispRef = React.useRef<SVGFEDisplacementMapElement>(null);
  const [cut, setCut] = React.useState(50); // before/after slider %
  const [intake, setIntake] = React.useState<{ open: boolean; pre?: string }>({ open: false });
  const openIntake = (pre?: string) => setIntake({ open: true, pre });

  // Scroll velocity → displacement scale. Idle wobble is ~6; fast scrolling
  // (or a coverflow slide, via "ee-melt") melts the codes up to ~90, easing
  // back down when things settle.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let last = el.scrollTop;
    let current = 6;
    let spike = 0;
    let raf = 0;
    const onMelt = () => {
      spike = 85;
    };
    window.addEventListener("ee-melt", onMelt);
    const tick = () => {
      const st = el.scrollTop;
      spike *= 0.93;
      const target = Math.max(Math.min(90, 6 + Math.abs(st - last) * 1.6), spike);
      last = st;
      current += (target - current) * 0.1;
      dispRef.current?.setAttribute("scale", current.toFixed(1));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("ee-melt", onMelt);
    };
  }, []);

  return (
    <div ref={scrollRef} className={`${styles.menu} ${leaving ? styles.leaving : ""}`}>
      {/* Shared liquid filter for every tile code */}
      <svg className={styles.defs} aria-hidden="true">
        <title>decorative filter</title>
        <defs>
          <filter id="ee-liquid" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves="2" result="noise">
              <animate attributeName="baseFrequency" dur="9s" values="0.012 0.05;0.02 0.09;0.012 0.05" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale="6" />
          </filter>
        </defs>
      </svg>

      {/* ===== Hero ===== */}
      <section className={styles.hero}>
        <div className={styles.eyebrow}>Denzel Rigaud — builder for hire</div>
        <h1 className={styles.headline}>
          AN IDEA
          <span className={styles.arrow}> ⟶ </span>
          REALITY<span className={styles.blink}>_</span>
        </h1>
        <p className={styles.sub}>
          You dream it. I build it. Apps, websites, AI automation — and everything in between, across every platform from Shopify
          to the App Store.
        </p>
        <div className={styles.heroKeywords}>
          website · app · online store · AI that texts your customers · logos · “can you automate this?” — yes.
        </div>
      </section>

      {/* ===== Before / After ===== */}
      <section className={styles.section}>
        <h2 className={styles.title}>
          Turn your boring work into <em>something extraordinary.</em>
        </h2>
        <p className={styles.tagline}>…while I teach you on the way.</p>

        <div className={styles.ba} style={{ "--cut": `${cut}%` } as React.CSSProperties}>
          <div className={styles.baBefore}>
            <div className={styles.baLabel}>BEFORE</div>
            <div className={styles.baCardBoring}>
              <strong>Joe’s Plumbing</strong>
              <span>Welcome to our website. We fix pipes. Call between 9 and 5.</span>
              <span className={styles.baDead}>Last updated 2017</span>
            </div>
          </div>
          <div className={styles.baAfter}>
            <div className={styles.baLabel}>AFTER</div>
            <div className={styles.baCardDope}>
              <strong>JOE’S PLUMBING ⚡</strong>
              <span>Pipes fixed in 24h. Book in 30 seconds.</span>
              <span className={styles.baLive}>● JARVIS is answering your texts right now</span>
            </div>
          </div>
          <div className={styles.baDivider} />
          <input
            className={styles.baRange}
            type="range"
            min={0}
            max={100}
            value={cut}
            aria-label="Drag to compare before and after"
            onChange={(e) => setCut(Number(e.target.value))}
          />
        </div>
      </section>

      {/* ===== THE MENU ===== */}
      <section className={styles.section}>
        <div className={styles.menuHead}>
          <h2 className={styles.title}>THE MENU</h2>
          <p className={styles.tagline}>flip through what your business is missing — swipe, scroll, or use the arrows</p>
        </div>
        <Coverflow onOrder={openIntake} />
      </section>

      {/* ===== JARVIS spotlight ===== */}
      <section className={styles.section}>
        <h2 className={styles.title}>
          Meet <em>JARVIS.</em>
        </h2>
        <p className={styles.tagline}>AI automation — your company, texting through your phone, 24/7</p>
        <div className={styles.phone}>
          <div className={styles.phoneBar}>Joe’s Plumbing · now</div>
          <div className={styles.msgIn}>hey do y’all do water heater installs??</div>
          <div className={styles.msgOut}>We do. Next opening is Thursday 9 AM — want me to lock it in for you?</div>
          <div className={styles.msgIn}>yes 🙏</div>
          <div className={styles.msgOut}>Booked ✓ Confirmation just hit your phone. Anything else?</div>
        </div>
        <p className={styles.jarvisCaption}>
          That’s not an employee. That’s your company answering by itself — while you sleep. Need a face for the brand? I’ll build
          you an <strong>AI spokesman</strong> too.
        </p>
        <button type="button" className={styles.cta} onClick={() => openIntake("J4")}>
          Give my business a JARVIS →
        </button>
      </section>

      {/* ===== Receipts marquee ===== */}
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          {[...RECEIPTS, ...RECEIPTS].map((r, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: list is duplicated for a seamless loop
            <span key={i}>{r} ·&nbsp;</span>
          ))}
        </div>
      </div>

      {/* ===== Proof: MyBibleLens ===== */}
      <section className={styles.section}>
        <div className={styles.eyebrow}>Exhibit A</div>
        <h2 className={styles.title}>
          I built <em>MyBibleLens.</em> Alone. Brick by brick.
        </h2>
        <p className={styles.sub}>
          The world’s first Bible Sanctuary app — designed, coded, shipped, and marketed by one person. Every screen, every
          animation, every line of code. So there’s no question about what I can or can’t do on the internet.
        </p>
        <a className={styles.cta} href="https://mybiblelens.us" target="_blank" rel="noopener noreferrer">
          See the proof →
        </a>
      </section>

      {/* ===== Mentorship callout ===== */}
      <section className={`${styles.section} ${styles.mentor}`}>
        <h2 className={styles.title}>
          Want the blueprint instead? <em>I’ll teach you.</em>
        </h2>
        <p className={styles.sub}>
          Mentorship is its own service: 1-on-1, no gatekeeping, until you fully understand how all of this works — from your
          first domain to your first AI automation.
        </p>
        <button type="button" className={styles.cta} onClick={() => openIntake("M7")}>
          Mentor me →
        </button>
      </section>

      {/* ===== About ===== */}
      <section className={`${styles.section} ${styles.about}`}>
        <div className={styles.eyebrow}>The builder</div>
        <p className={styles.sub}>
          Denzel Rigaud — Communications, Marketing &amp; Advertising, Lynn University, Class of ’27. I don’t just build it. I
          make people look at it.
        </p>
        <a className={styles.cta} href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
          @smiledenzel →
        </a>
      </section>

      <IntakeModal open={intake.open} preselect={intake.pre} onClose={() => setIntake({ open: false })} />

      {/* The speakeasy door — everything else on this site lives behind it. */}
      <button type="button" className={styles.egg} aria-label="Enter" onClick={onOpen}>
        🥚
      </button>
    </div>
  );
}
