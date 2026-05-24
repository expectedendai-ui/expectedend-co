import * as React from "react";
import styles from "./style.module.css";

const CELL_SIZE = 36;
const SHOW_MS = 2200;
const FADE_MS = 600;

type Digit = { value: "0" | "1"; fallDelay: string; flickerDelay: string };

function buildDigits(): Digit[] {
  const cols = Math.ceil(window.innerWidth / CELL_SIZE);
  const rows = Math.ceil(window.innerHeight / CELL_SIZE);
  const count = cols * rows;
  const out: Digit[] = new Array(count);
  for (let i = 0; i < count; i++) {
    out[i] = {
      value: Math.random() < 0.5 ? "0" : "1",
      fallDelay: `${(Math.random() * 2).toFixed(2)}s`,
      flickerDelay: `${(Math.random() * 1.6).toFixed(2)}s`,
    };
  }
  return out;
}

export function MatrixLoader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = React.useState<"visible" | "fading">("visible");
  const digits = React.useMemo(buildDigits, []);

  React.useEffect(() => {
    const fade = setTimeout(() => setPhase("fading"), SHOW_MS);
    const done = setTimeout(onDone, SHOW_MS + FADE_MS);
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div className={`${styles.overlay} ${phase === "fading" ? styles.fading : ""}`}>
      <div className={styles.glow} />
      <div className={styles.grid}>
        {digits.map((d, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: digits are positional and never reorder
            key={i}
            className={styles.digit}
            style={{ animationDelay: `${d.fallDelay}, ${d.flickerDelay}` }}
          >
            {d.value}
          </span>
        ))}
      </div>
    </div>
  );
}
