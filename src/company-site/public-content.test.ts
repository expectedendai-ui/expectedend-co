import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CONTACT_HREF, PUBLIC_CONTENT_APPROVED } from "./content";

describe("public-content deployment guard", () => {
  it("runs the approval gate before production deploy", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts: { deploy: string };
    };
    expect(packageJson.scripts.deploy).toMatch(/^npm run check:public-content &&/);
  });
});

describe.skipIf(process.env.RELEASE_CHECK !== "1")("public-content release gate", () => {
  it("requires explicit owner approval before production release", () => {
    expect(CONTACT_HREF).toBe("/about#contact");
    expect(PUBLIC_CONTENT_APPROVED).toBe(true);
  });
});
