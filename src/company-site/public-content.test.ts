import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateWaterCheckRelease, WATER_CHECK_RELEASE_EVIDENCE } from "../water-check/legal/water-check-release-evidence";
import { CONTACT_HREF, PUBLIC_CONTENT_APPROVED } from "./content";
import { getRouteMetadata } from "./routes";

const WATER_CHECK_GOVERNED_SOURCE_PATHS = [
  "src/water-check/water-check-page.tsx",
  "src/water-check/legal/water-check-legal-content.ts",
] as const;

const WATER_CHECK_PATHS = [
  "/thewatercheck",
  "/thewatercheck/privacy",
  "/thewatercheck/terms",
  "/thewatercheck/health-and-ai-disclaimer",
  "/thewatercheck/consumer-health-data",
] as const;

const readWaterCheckGovernedSources = () =>
  WATER_CHECK_GOVERNED_SOURCE_PATHS.map((path) => readFileSync(path, "utf8")).concat(
    JSON.stringify(WATER_CHECK_PATHS.map((path) => getRouteMetadata(path)))
  );

const readPublicTextFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return readPublicTextFiles(path);
    return /\.(?:html|json|txt|xml|webmanifest)$/i.test(entry.name) ? [readFileSync(path, "utf8")] : [];
  });

describe("public-content deployment guard", () => {
  it("runs the approval gate before production deploy", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts: { deploy: string };
    };
    expect(packageJson.scripts.deploy).toMatch(/^npm run check:public-content &&/);
  });

  it("does not expose a personal Gmail address in public files", () => {
    const publicText = [readFileSync("index.html", "utf8"), ...readPublicTextFiles("public")].join("\n");
    expect(publicText).not.toMatch(/[a-z0-9._%+-]+@gmail\.com/i);
    expect(publicText).not.toMatch(/"email"\s*:/);
  });
});

describe.skipIf(process.env.RELEASE_CHECK !== "1")("public-content release gate", () => {
  it("requires explicit owner approval before production release", () => {
    expect(CONTACT_HREF).toBe("/about#contact");
    expect(PUBLIC_CONTENT_APPROVED).toBe(true);
  });

  it("requires independent, content-bound Water Check release evidence", () => {
    const validation = validateWaterCheckRelease(WATER_CHECK_RELEASE_EVIDENCE, readWaterCheckGovernedSources());
    expect(validation.errors, validation.errors.join("\n")).toEqual([]);
    expect(validation.valid).toBe(true);
  });
});
