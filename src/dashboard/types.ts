export type TileKind = "bug" | "canvas";

export type BugSpecies = "🐛" | "🪲" | "🪳" | "🐜" | "🕷️" | "🪰" | "🦟";

export const BUG_SPECIES: BugSpecies[] = ["🐛", "🪲", "🪳", "🐜", "🕷️", "🪰", "🦟"];

export type Tile = {
  id: number;
  kind: TileKind;
  species?: BugSpecies;
  x: number;
  y: number;
  vx: number;
  vy: number;
};
