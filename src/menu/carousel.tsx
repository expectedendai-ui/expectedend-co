import * as React from "react";
import { SERVICES } from "./services";
import styles from "./style.module.css";

// Coverflow for THE MENU — services browsed like album covers (center card
// flat, neighbors rotated away in 3D). Wheel, swipe, arrow keys, and the
// ‹ › buttons all step through; no play button.

// Giant icon rendered as SVG <text> so the turbulence filter works in every
// browser (Safari won't apply SVG filters to plain HTML reliably).
function DistortIcon({ icon }: { icon: string }) {
  return (
    <svg className={styles.flowCode} viewBox="0 0 320 200" aria-hidden="true">
      <text x="50%" y="54%" textAnchor="middle" dominantBaseline="central" filter="url(#ee-liquid)">
        {icon}
      </text>
    </svg>
  );
}

const last = SERVICES.length - 1;
const clamp = (i: number) => Math.max(0, Math.min(last, i));

export function Coverflow({ onOrder }: { onOrder: (code: string) => void }) {
  const [index, setIndex] = React.useState(0);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelAcc = React.useRef(0);
  const wheelLock = React.useRef(0);
  const dragX = React.useRef<number | null>(null);

  const go = React.useCallback((to: number) => {
    setIndex((prev) => {
      const next = clamp(to);
      // melt the codes during the slide (picked up by the filter loop)
      if (next !== prev) window.dispatchEvent(new CustomEvent("ee-melt"));
      return next;
    });
  }, []);
  const step = React.useCallback((d: number) => {
    setIndex((prev) => {
      const next = clamp(prev + d);
      if (next !== prev) window.dispatchEvent(new CustomEvent("ee-melt"));
      return next;
    });
  }, []);

  // Wheel over the stage steps the deck (non-passive so we can stop the
  // page from scrolling underneath while browsing).
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLock.current < 450) return;
      wheelAcc.current += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(wheelAcc.current) > 50) {
        step(wheelAcc.current > 0 ? 1 : -1);
        wheelAcc.current = 0;
        wheelLock.current = now;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [step]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const active = SERVICES[index];

  return (
    <div className={styles.flowWrap}>
      <div
        ref={stageRef}
        className={styles.flowStage}
        onPointerDown={(e) => {
          dragX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (dragX.current === null) return;
          const dx = e.clientX - dragX.current;
          dragX.current = null;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        }}
      >
        {SERVICES.map((s, i) => {
          const off = i - index;
          const abs = Math.abs(off);
          const x = off * 0.74; // in card widths
          const rot = off === 0 ? 0 : off < 0 ? 42 : -42;
          const scale = off === 0 ? 1 : abs === 1 ? 0.68 : 0.52;
          return (
            <button
              key={s.code}
              type="button"
              className={styles.flowCard}
              aria-label={off === 0 ? `Order ${s.name}` : `Show ${s.name}`}
              style={{
                transform: `translate(-50%, -50%) translateX(calc(var(--card-w) * ${x})) rotateY(${rot}deg) scale(${scale})`,
                zIndex: 10 - abs,
                opacity: abs > 2 ? 0 : abs === 2 ? 0.4 : 1,
                pointerEvents: abs > 2 ? "none" : "auto",
              }}
              onClick={() => (off === 0 ? onOrder(s.code) : go(i))}
            >
              <DistortIcon icon={s.icon} />
              <span className={styles.flowExample}>{s.example}</span>
            </button>
          );
        })}
      </div>

      {/* Active service details — like the track title under the covers */}
      <div className={styles.flowInfo} key={active.code}>
        <div className={styles.hook}>{active.hook}</div>
        <h3 className={styles.flowName}>{active.name}</h3>
        <ul className={styles.flowTags}>
          {active.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className={styles.flowOrderRow}>
          <button type="button" className={styles.order} onClick={() => onOrder(active.code)}>
            order this →
          </button>
        </div>
      </div>

      <div className={styles.flowNav}>
        <button
          type="button"
          className={styles.flowBtn}
          aria-label="Previous service"
          disabled={index === 0}
          onClick={() => step(-1)}
        >
          ‹
        </button>
        <span className={styles.flowCount}>
          0{index + 1} / 0{SERVICES.length}
        </span>
        <button
          type="button"
          className={styles.flowBtn}
          aria-label="Next service"
          disabled={index === last}
          onClick={() => step(1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
