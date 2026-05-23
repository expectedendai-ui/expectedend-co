import * as React from "react";
import styles from "./style.module.css";

export function PageLoader({ progress }: { progress: number }) {
  const [show, setShow] = React.useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = React.useState(false);
  const [jokePhase, setJokePhase] = React.useState<"tap" | "punchline">("tap");
  const visualRef = React.useRef(0);
  const [visualProgress, setVisualProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const flip = setTimeout(() => setJokePhase("punchline"), 700);
    return () => clearTimeout(flip);
  }, []);

  React.useEffect(() => {
    let raf: number;

    const animate = () => {
      const diff = progress - visualRef.current;

      if (diff > 0.1) {
        visualRef.current += diff * 0.08;
        setVisualProgress(visualRef.current);
        raf = requestAnimationFrame(animate);
      } else {
        visualRef.current = progress;
        setVisualProgress(progress);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  React.useEffect(() => {
    if (minTimeElapsed && progress === 100 && visualProgress >= 99.5) {
      const t = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(t);
    }
  }, [minTimeElapsed, progress, visualProgress]);

  if (!show) {
    return null;
  }

  const isHidden = minTimeElapsed && progress === 100 && visualProgress >= 99.5;

  return (
    <div className={`${styles.overlay} ${isHidden ? styles.hidden : styles.visible}`}>
      <div className={styles.stack}>
        {jokePhase === "tap" ? (
          <div className={styles.tapPrompt}>Tap</div>
        ) : (
          <div className={styles.punchline}>just kidding it's a loader haha</div>
        )}
      </div>
    </div>
  );
}
