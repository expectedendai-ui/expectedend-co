import * as React from "react";
import { Coverflow } from "./carousel";
import { IntakeModal } from "./intake";
import { INSTAGRAM } from "./services";
import styles from "./style.module.css";

// THE MENU — front-of-house services page, shown immediately on load.
// Codrops "Text Distortion Effects" energy (big tiles, giant codes that
// liquefy with scroll speed) rebuilt with SVG turbulence instead of
// Blotter.js so it runs fast on phones. The art world (song gate → infinite
// canvas) stays hidden behind the 🥚 easter egg in the bottom-right corner.

const PRICING = [
  { name: "Landing Page Websites", starts: "$250" },
  { name: "iOS & Android Apps", starts: "$1,500" },
  { name: "Shopify E-commerce Stores", starts: "$400" },
  { name: "AI Automations & Webhooks", starts: "$150" },
  { name: "Icons & Logos", starts: "$100" },
  { name: "Canva Art Content & Social Assets", starts: "$50" },
  { name: "Mentorship & Consulting", starts: "$75 / session" },
];

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
  const [water, setWater] = React.useState(false);
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
          YOU DREAM IT
          <span className={styles.arrow}> ⟶ </span>I BUILD IT<span className={styles.blink}>_</span>
        </h1>
        <p className={styles.sub}>
          Apps, websites, AI automation — and everything in between, across every platform from Shopify to the App Store.
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

      {/* ===== Transparent Pricing ===== */}
      <section className={styles.section}>
        <div className={styles.eyebrow}>The damage</div>
        <h2 className={styles.title}>
          Transparent <em>Pricing</em>
        </h2>
        <p className={styles.pricingMission}>
          My mission is to help you <em>build, launch, and succeed</em> — not to drain your startup funds. I know how hard it is
          to get a business off the ground. That’s why Expected End uses transparent pricing. You will always know your exact
          starting price — no surprises, no games. <em>Let’s get to work.</em>
        </p>
        <div className={styles.priceGrid}>
          {PRICING.map((tier) => (
            <article key={tier.name} className={styles.priceCard}>
              <h3 className={styles.priceName}>{tier.name}</h3>
              <div className={styles.priceStarts}>
                <span className={styles.priceLabel}>Starts at</span>
                <span className={styles.priceValue}>{tier.starts}</span>
              </div>
            </article>
          ))}
        </div>
        <button type="button" className={styles.cta} onClick={() => openIntake()}>
          Get Started →
        </button>
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

      {/* ===== What happened to @thewatercheck ===== */}
      <section className={`${styles.section} ${styles.watercheck}`}>
        <div className={styles.eyebrow}>The one that got away</div>
        <h2 className={styles.title}>
          What happened to <em>@thewatercheck?</em>
        </h2>
        <p className={styles.tagline}>the honest answer — tap to read</p>
        <button type="button" className={styles.cta} onClick={() => setWater(true)}>
          @thewatercheck →
        </button>
      </section>

      <IntakeModal open={intake.open} preselect={intake.pre} onClose={() => setIntake({ open: false })} />
      <WaterCheckModal open={water} onClose={() => setWater(false)} />

      {/* The speakeasy door — everything else on this site lives behind it. */}
      <button type="button" className={styles.egg} aria-label="Enter" onClick={onOpen}>
        🥚
      </button>
    </div>
  );
}

const APP_STORE = "https://apps.apple.com/us/app/mybiblelens/id6764069602";
const MBL_ABOUT = "https://mybiblelens.us/legal.html#about";

// The @thewatercheck story — the honest post-mortem of the account, shown in a
// scrollable card that mirrors the intake modal's shell.
function WaterCheckModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.intakeWrap}>
      <button type="button" className={styles.intakeBackdrop} aria-label="Close" onClick={onClose} />
      <div className={`${styles.intake} ${styles.waterModal}`}>
        <button type="button" className={styles.intakeClose} aria-label="Close" onClick={onClose}>
          ×
        </button>
        <div className={styles.intakeEyebrow}>The one that got away</div>
        <div className={styles.intakeTitle}>What happened to @thewatercheck</div>

        <div className={styles.waterStory}>
          <p>
            I bought the account when I was 16. At the time I was still scaling Influencers, makeup accounts, etc.
          </p>
          <p>
            I later moved in with my dad. The account was dying — because <em>“if you chase two rabbits, you will not catch
            either one.”</em> <span className={styles.waterSource}>— Russian proverb</span>
          </p>
          <p>
            And as of now I realize that your brain seriously cannot focus on almost two things at a time, because you’ll create
            newer pathways over the pathways you originally had — and the one big plan you wanted to do would disappear. As a kid I
            just wanted to make money. I wasn’t thinking long-term, because I thought hustling was the way to go.
          </p>
          <p>
            Then my father passed away unexpectedly <strong>July 10th, 2021.</strong> So I went into survival mode over where my
            life was going to go… and to deal with the pain of his death, I shut the door on being the web wizard my father once
            taught me to be — to heal the pain… until <strong>January 2026.</strong>
          </p>
          <p>
            And yeah! Will I ever go back to theWaterCheck now? I want to sell it — <strong>minimum $100k.</strong> Why? Because
            you’d be surprised how much people make selling domain names and an Instagram name. As simple as it is — why not? It’s
            the world of opportunities. I want to focus on{" "}
            <a className={styles.waterLink} href={APP_STORE} target="_blank" rel="noopener noreferrer">
              @mybiblelens
            </a>
            .
          </p>
          <p>
            So if I do sell it, all the money is going to go to building{" "}
            <a className={styles.waterLink} href={MBL_ABOUT} target="_blank" rel="noopener noreferrer">
              @mybiblelens
            </a>
            .
          </p>
        </div>

        <div className={styles.waterStat}>
          <span className={styles.waterStatFrom}>200,000 followers</span>
          <span className={styles.waterStatArrow}>⟶</span>
          <span className={styles.waterStatTo}>7,000</span>
          <span className={styles.waterStatCaption}>that’s where it’s at now.</span>
        </div>

        {/* ===== What was theWaterCheck? ===== */}
        <div className={styles.waterWhat}>
          <div className={styles.intakeEyebrow}>So what was it?</div>
          <div className={styles.waterStory}>
            <p>
              What was theWaterCheck? It was simply this: I posted a picture every single day to remind people to drink water — and
              it actually helped them drink water. The comments were <em>flooded</em> with people. That’s all it did — remind people
              to drink water — and people loved it.
            </p>
            <p>
              Then I had a bot erase everything off the page… and life happened from there.
            </p>
          </div>

          <div className={styles.waterPhone}>
            <div className={styles.waterPhoneNotch} />
            {/* biome-ignore lint/a11y/useMediaCaption: silent screen-recording of IG comments, no spoken content */}
            <video
              className={styles.waterVideo}
              src="/watercheck-demo.mp4"
              poster="/watercheck-poster.jpg"
              controls
              playsInline
              preload="metadata"
            />
          </div>
          <p className={styles.waterVideoCaption}>look how many people loved it.</p>
        </div>
      </div>
    </div>
  );
}
