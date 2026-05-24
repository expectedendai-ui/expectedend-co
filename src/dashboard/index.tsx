import * as React from "react";
import styles from "./style.module.css";
import { BUG_SPECIES, type BugSpecies, type Tile } from "./types";

const TILE_SIZE = 88;
const BUGS_PER_CLICK = 50;

function makeTiles(): Tile[] {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const margin = 80;
  const slots: Tile[] = [];

  const speciesShuffled = [...BUG_SPECIES].sort(() => Math.random() - 0.5);
  const canvasIndex = Math.floor(Math.random() * 8);

  for (let i = 0; i < 8; i++) {
    const kind = i === canvasIndex ? "canvas" : "bug";
    const species = kind === "bug" ? speciesShuffled.pop() : undefined;
    const angle = Math.random() * Math.PI * 2;
    const speed = 25 + Math.random() * 35;
    slots.push({
      id: i,
      kind,
      species,
      x: margin + Math.random() * (w - margin * 2 - TILE_SIZE),
      y: margin + Math.random() * (h - margin * 2 - TILE_SIZE),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    });
  }
  return slots;
}

type Props = {
  active: boolean;
  onSpawnBugs: (species: BugSpecies, count: number) => void;
  onEnterCanvas: () => void;
};

export function DashboardOverlay({ active, onSpawnBugs, onEnterCanvas }: Props) {
  const tilesRef = React.useRef<Tile[]>([]);
  const nodeRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    tilesRef.current = makeTiles();
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready || !active) return;
    let raf = 0;
    let lastT = performance.now();

    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const tiles = tilesRef.current;

      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        tile.x += tile.vx * dt;
        tile.y += tile.vy * dt;

        if (tile.x < 0) {
          tile.x = 0;
          tile.vx = Math.abs(tile.vx);
        } else if (tile.x > w - TILE_SIZE) {
          tile.x = w - TILE_SIZE;
          tile.vx = -Math.abs(tile.vx);
        }
        if (tile.y < 0) {
          tile.y = 0;
          tile.vy = Math.abs(tile.vy);
        } else if (tile.y > h - TILE_SIZE) {
          tile.y = h - TILE_SIZE;
          tile.vy = -Math.abs(tile.vy);
        }

        const node = nodeRefs.current[i];
        if (node) {
          node.style.transform = `translate(${tile.x}px, ${tile.y}px)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, active]);

  const handleClick = (tile: Tile) => {
    if (tile.kind === "canvas") {
      onEnterCanvas();
    } else if (tile.species) {
      onSpawnBugs(tile.species, BUGS_PER_CLICK);
    }
  };

  if (!ready) return null;

  return (
    <div className={`${styles.overlay} ${active ? styles.visible : styles.hidden}`}>
      {tilesRef.current.map((tile, i) => (
        <button
          key={tile.id}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          type="button"
          className={styles.tile}
          onClick={() => handleClick(tile)}
          aria-label="Mystery tile"
        >
          <span className={styles.tileLabel}>?</span>
        </button>
      ))}
    </div>
  );
}
