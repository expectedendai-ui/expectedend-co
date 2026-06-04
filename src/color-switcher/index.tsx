import styles from "./style.module.css";

export type ThemeKey = "black" | "white" | "brown";

// Each theme drives both the <body> palette (via data-theme in index.css) and
// the Three.js fog color (passed to InfiniteCanvas). Keep `fog` in sync with the
// --color-background value for the matching body[data-theme] block in index.css.
export const THEMES: { key: ThemeKey; label: string; swatch: string; fog: string }[] = [
  { key: "black", label: "Black", swatch: "#0a0a0a", fog: "#0a0a0a" },
  { key: "white", label: "White", swatch: "#f4f1ea", fog: "#f4f1ea" },
  { key: "brown", label: "Brown", swatch: "#241a12", fog: "#241a12" },
];

export function ColorSwitcher({ active, onChange }: { active: ThemeKey; onChange: (k: ThemeKey) => void }) {
  return (
    <div className={styles.switcher}>
      {THEMES.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`${styles.swatch} ${t.key === active ? styles.active : ""}`}
          style={{ background: t.swatch }}
          title={t.label}
          aria-label={`${t.label} background`}
          aria-pressed={t.key === active}
          onClick={() => onChange(t.key)}
        />
      ))}
    </div>
  );
}
