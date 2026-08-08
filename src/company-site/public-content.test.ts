import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getWaterCheckRenderedReleaseFacts } from "../water-check/legal/water-check-release-content";
import { validateWaterCheckRelease, WATER_CHECK_RELEASE_EVIDENCE } from "../water-check/legal/water-check-release-evidence";
import { CONTACT_HREF, PUBLIC_CONTENT_APPROVED } from "./content";
import { getRouteMetadata } from "./routes";

const WATER_CHECK_GOVERNED_SOURCE_PATHS = [
  "src/water-check/water-check-page.tsx",
  "src/water-check/water-check-shell.tsx",
  "src/water-check/legal/water-check-legal-content.ts",
  "src/water-check/legal/water-check-legal-page.tsx",
  "docs/legal/water-check-deployment-data-inventory.md",
] as const;

const WATER_CHECK_DEPLOYMENT_INVENTORY_PATH = "docs/legal/water-check-deployment-data-inventory.md";

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

  it("publishes the Water Check route family in static discovery surfaces", () => {
    const indexHtml = readFileSync("index.html", "utf8");
    const sitemap = readFileSync("public/sitemap.xml", "utf8");

    for (const path of WATER_CHECK_PATHS) {
      expect(sitemap).toContain(`<loc>https://expectedend.co${path}</loc>`);
    }
    expect(indexHtml).toContain('"url": "https://expectedend.co/thewatercheck"');
    expect(indexHtml).toContain('"sameAs": [\n              "https://www.instagram.com/thewatercheck/"\n            ]');
  });

  it("loads fonts from same-origin assets instead of Google Fonts", () => {
    const indexHtml = readFileSync("index.html", "utf8");
    const globalStyles = readFileSync("src/index.css", "utf8");

    expect(indexHtml).not.toMatch(/fonts\.(?:googleapis|gstatic)\.com/);
    expect(globalStyles).toContain('url("/fonts/dm-sans-latin.woff2") format("woff2")');
    expect(globalStyles).toContain('url("/fonts/hammersmith-one-latin.woff2") format("woff2")');
    expect(globalStyles).toContain('url("/fonts/instrument-serif-latin.woff2") format("woff2")');
    expect(globalStyles).toContain('url("/fonts/instrument-serif-italic-latin.woff2") format("woff2")');
  });
});

describe.skipIf(process.env.RELEASE_CHECK !== "1")("public-content release gate", () => {
  it("requires explicit owner approval before production release", () => {
    expect(CONTACT_HREF).toBe("/about#contact");
    expect(PUBLIC_CONTENT_APPROVED).toBe(true);
  });

  it("requires independent, content-bound Water Check release evidence", () => {
    const validation = validateWaterCheckRelease(WATER_CHECK_RELEASE_EVIDENCE, {
      governedSources: readWaterCheckGovernedSources(),
      renderedFacts: getWaterCheckRenderedReleaseFacts(WATER_CHECK_RELEASE_EVIDENCE),
      deploymentInventoryDocument: readFileSync(WATER_CHECK_DEPLOYMENT_INVENTORY_PATH, "utf8"),
    });
    expect(validation.errors, validation.errors.join("\n")).toEqual([]);
    expect(validation.valid).toBe(true);
  });
});
