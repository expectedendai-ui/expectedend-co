import * as React from "react";
import type { BugSpecies } from "~/src/dashboard/types";
import styles from "./style.module.css";

const MAX_BUGS = 300;
const BUG_SIZE = 22;

type Bug = {
  id: number;
  species: BugSpecies;
  x: number;
  y: number;
  vx: number;
  vy: number;
  nextKick: number;
};

export type BugSwarmHandle = {
  spawn: (species: BugSpecies, count: number) => void;
  clear: () => void;
};

let nextId = 0;

function randomVelocity(): { vx: number; vy: number } {
  const angle = Math.random() * Math.PI * 2;
  const speed = 18 + Math.random() * 35;
  return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
}

export function BugSwarm({ ref }: { ref?: React.Ref<BugSwarmHandle> }) {
  const bugsRef = React.useRef<Bug[]>([]);
  const nodeRefs = React.useRef<Map<number, HTMLSpanElement>>(new Map());
  const [, force] = React.useReducer((x: number) => x + 1, 0);
  const [exiting, setExiting] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    spawn: (species, count) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const fresh: Bug[] = [];
      for (let i = 0; i < count; i++) {
        const v = randomVelocity();
        fresh.push({
          id: nextId++,
          species,
          x: Math.random() * (w - BUG_SIZE),
          y: Math.random() * (h - BUG_SIZE),
          vx: v.vx,
          vy: v.vy,
          nextKick: 0.5 + Math.random() * 2,
        });
      }
      const combined = [...bugsRef.current, ...fresh];
      bugsRef.current = combined.length > MAX_BUGS ? combined.slice(combined.length - MAX_BUGS) : combined;
      setExiting(false);
      force();
    },
    clear: () => {
      setExiting(true);
      window.setTimeout(() => {
        bugsRef.current = [];
        nodeRefs.current.clear();
        setExiting(false);
        force();
      }, 450);
    },
  }));

  React.useEffect(() => {
    let raf = 0;
    let lastT = performance.now();

    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const bugs = bugsRef.current;

      for (let i = 0; i < bugs.length; i++) {
        const bug = bugs[i];
        bug.x += bug.vx * dt;
        bug.y += bug.vy * dt;

        bug.nextKick -= dt;
        if (bug.nextKick <= 0) {
          const turn = (Math.random() - 0.5) * Math.PI * 0.9;
          const speed = 18 + Math.random() * 35;
          const newAngle = Math.atan2(bug.vy, bug.vx) + turn;
          bug.vx = Math.cos(newAngle) * speed;
          bug.vy = Math.sin(newAngle) * speed;
          bug.nextKick = 0.5 + Math.random() * 2;
        }

        if (bug.x < 0) {
          bug.x = 0;
          bug.vx = Math.abs(bug.vx);
        } else if (bug.x > w - BUG_SIZE) {
          bug.x = w - BUG_SIZE;
          bug.vx = -Math.abs(bug.vx);
        }
        if (bug.y < 0) {
          bug.y = 0;
          bug.vy = Math.abs(bug.vy);
        } else if (bug.y > h - BUG_SIZE) {
          bug.y = h - BUG_SIZE;
          bug.vy = -Math.abs(bug.vy);
        }

        const node = nodeRefs.current.get(bug.id);
        if (node) {
          node.style.transform = `translate(${bug.x}px, ${bug.y}px)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`${styles.layer} ${exiting ? styles.exiting : ""}`} aria-hidden="true">
      {bugsRef.current.map((bug) => (
        <span
          key={bug.id}
          ref={(el) => {
            if (el) {
              nodeRefs.current.set(bug.id, el);
            } else {
              nodeRefs.current.delete(bug.id);
            }
          }}
          className={styles.bug}
        >
          {bug.species}
        </span>
      ))}
    </div>
  );
}
