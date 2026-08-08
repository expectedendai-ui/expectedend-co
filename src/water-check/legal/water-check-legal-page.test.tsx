import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CompanySite } from "../../company-site";
import { WATER_CHECK_LEGAL_CONTENT, type WaterCheckLegalKey } from "./water-check-legal-content";
import { WaterCheckLegalPage } from "./water-check-legal-page";
import {
  createWaterCheckGovernedDigest,
  validateWaterCheckRelease,
  WATER_CHECK_RELEASE_EVIDENCE,
  type WaterCheckReleaseEvidence,
} from "./water-check-release-evidence";

const ROUTES: Array<[string, WaterCheckLegalKey, string]> = [
  ["/thewatercheck/privacy", "privacy", "Privacy"],
  ["/thewatercheck/terms", "terms", "Terms"],
  ["/thewatercheck/health-and-ai-disclaimer", "health-and-ai-disclaimer", "Health & AI Disclaimer"],
  ["/thewatercheck/consumer-health-data", "consumer-health-data", "Consumer Health Data"],
];

const validEvidence = (governedSources: readonly string[]): WaterCheckReleaseEvidence => ({
  ...WATER_CHECK_RELEASE_EVIDENCE,
  entityName: "Example Product Company",
  contactPath: "/about#contact",
  effectiveDate: "2026-09-15",
  approvedBy: "Product owner",
  approvedAt: "2026-09-14",
  governedContentDigest: createWaterCheckGovernedDigest(governedSources),
  deploymentInventoryApprovedBy: "Infrastructure owner",
  deploymentInventoryApprovedAt: "2026-09-14",
});

describe("Water Check legal pages", () => {
  it.each(ROUTES)("renders substantive product-owned content at %s", async (path, key, heading) => {
    window.history.replaceState({}, "", path);
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(<CompanySite leaving={false} onOpenArtWorld={vi.fn()} />);

    const article = screen.getByRole("article", { name: heading });
    expect(within(article).getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expect(within(article).getByText(/effective date: pending owner approval/i)).toBeInTheDocument();
    expect(within(article).queryByText(/product-specific information will be published here/i)).not.toBeInTheDocument();
    expect(within(article).getByRole("link", { name: /return to the water check/i })).toHaveAttribute("href", "/thewatercheck");
    expect(within(article).getAllByRole("heading", { level: 2 }).length).toBeGreaterThanOrEqual(4);

    const footer = screen.getByRole("navigation", { name: "Water Check legal navigation" });
    expect(within(footer).getByRole("link", { name: WATER_CHECK_LEGAL_CONTENT[key].footerLabel })).toHaveAttribute(
      "aria-current",
      "page"
    );

    await user.click(within(article).getByRole("link", { name: /return to the water check/i }));
    expect(window.location.pathname).toBe("/thewatercheck");
  });

  it("states the current no-submission contract without claiming zero operational processing", () => {
    render(<WaterCheckLegalPage content={WATER_CHECK_LEGAL_CONTENT.privacy} onNavigate={vi.fn()} />);
    const article = screen.getByRole("article", { name: "Privacy" });

    expect(article).toHaveTextContent(/current coming soon website/i);
    expect(article).toHaveTextContent(/does not provide a way to submit health information/i);
    expect(article).toHaveTextContent(
      /product scans, ai conversations, email addresses, accounts, age, gender, ethnicity, or racial identity/i
    );
    expect(article).toHaveTextContent(/18\+.*eligibility.*not.*collect/i);
    expect(article).toHaveTextContent(/hosting, content-delivery, networking, and security services may process.*request/i);
    expect(article).toHaveTextContent(/exact fields.*recipients.*retention.*not yet been verified/i);
    expect(article).not.toHaveTextContent(/collect(?:s|ed)? no (?:personal|technical|operational) (?:data|information)/i);
    expect(article.querySelector("form, input, select, textarea")).not.toBeInTheDocument();
  });

  it("keeps future app intentions conditional and avoids unsupported current rights or vendors", () => {
    const allLegalCopy = JSON.stringify(WATER_CHECK_LEGAL_CONTENT);

    expect(allLegalCopy).toMatch(/future app/i);
    expect(allLegalCopy).toMatch(/planned/i);
    expect(allLegalCopy).toMatch(/new notice/i);
    expect(allLegalCopy).toMatch(/optional.*purpose-specific/i);
    expect(allLegalCopy).toMatch(/prefer not to say/i);
    expect(allLegalCopy).toMatch(/privacy and equity review/i);
    expect(allLegalCopy).not.toMatch(/cal ai|flo health/i);
    expect(allLegalCopy).not.toMatch(/you (?:may|can) (?:delete|export|download) your data/i);
    expect(allLegalCopy).not.toMatch(/retained? for \d+ (?:days?|months?|years?)/i);
    expect(allLegalCopy).not.toMatch(/hipaa|washington my health my data|nevada sb 370|gdpr|ccpa/i);
  });

  it("makes the website and future product informational, approximate, adult-only, and non-medical", () => {
    const terms = JSON.stringify(WATER_CHECK_LEGAL_CONTENT.terms);
    const disclaimer = JSON.stringify(WATER_CHECK_LEGAL_CONTENT["health-and-ai-disclaimer"]);
    const consumerHealth = JSON.stringify(WATER_CHECK_LEGAL_CONTENT["consumer-health-data"]);

    expect(terms).toMatch(/18 and older/i);
    expect(terms).toMatch(/informational/i);
    expect(disclaimer).toMatch(/educational/i);
    expect(disclaimer).toMatch(/approximate/i);
    expect(disclaimer).toMatch(/potentially incomplete/i);
    expect(disclaimer).toMatch(/does not diagnose, treat, or prevent/i);
    expect(disclaimer).toMatch(/definitive cause/i);
    expect(consumerHealth).toMatch(/current coming soon website/i);
    expect(consumerHealth).toMatch(/does not provide a way to submit consumer health data/i);
    expect(consumerHealth).toMatch(/does not assert that any particular consumer-health law applies/i);
  });

  it("does not repeat the campaign hook in legal copy or headings", () => {
    const allLegalCopy = JSON.stringify(WATER_CHECK_LEGAL_CONTENT);
    expect(allLegalCopy).not.toMatch(/you(?:'|’)re not fat/i);
    expect(allLegalCopy).not.toMatch(/snap\. track\. debloat/i);
  });
});

describe("Water Check release evidence", () => {
  const governedSources = ["approved landing health claims", "approved legal copy"];
  const unresolvedDraftSources = ["landing health claims", JSON.stringify(WATER_CHECK_LEGAL_CONTENT)];

  it("keeps repository-derived candidates explicitly unresolved", () => {
    expect(WATER_CHECK_RELEASE_EVIDENCE.candidateEntityName).toBe("Expected End LLC");
    expect(WATER_CHECK_RELEASE_EVIDENCE.candidateContactPath).toBe("/about#contact");
    expect(WATER_CHECK_RELEASE_EVIDENCE.entityName).toBeNull();
    expect(WATER_CHECK_RELEASE_EVIDENCE.contactPath).toBeNull();
    expect(WATER_CHECK_RELEASE_EVIDENCE.effectiveDate).toBeNull();
    expect(validateWaterCheckRelease(WATER_CHECK_RELEASE_EVIDENCE, unresolvedDraftSources)).toMatchObject({
      valid: false,
      errors: expect.arrayContaining([expect.stringMatching(/unresolved token/i)]),
    });
  });

  it("accepts exact, synthetic owner and deployment approval evidence", () => {
    expect(validateWaterCheckRelease(validEvidence(governedSources), governedSources)).toEqual({ valid: true, errors: [] });
  });

  it("rejects missing owner facts, unresolved tokens, and stale governed copy", () => {
    const approved = validEvidence(governedSources);
    const missingOwnerFacts: WaterCheckReleaseEvidence = {
      ...approved,
      entityName: null,
      approvedBy: null,
    };
    expect(validateWaterCheckRelease(missingOwnerFacts, governedSources).errors).toEqual(
      expect.arrayContaining([expect.stringMatching(/entity name/i), expect.stringMatching(/approver/i)])
    );

    const unresolvedCopy = [...governedSources, "TODO: decide this claim"];
    expect(validateWaterCheckRelease(validEvidence(unresolvedCopy), unresolvedCopy).errors).toEqual(
      expect.arrayContaining([expect.stringMatching(/unresolved token/i)])
    );

    expect(validateWaterCheckRelease(approved, [...governedSources, "changed after approval"]).errors).toEqual(
      expect.arrayContaining([expect.stringMatching(/digest/i)])
    );
  });

  it("rejects unsupported data-rights promises and invented fixed retention periods", () => {
    const approved = validEvidence(governedSources);
    expect(validateWaterCheckRelease(approved, [...governedSources, "You can export and delete your data."]).errors).toEqual(
      expect.arrayContaining([expect.stringMatching(/unsupported deletion or export promise/i)])
    );
    expect(validateWaterCheckRelease(approved, [...governedSources, "We retain request logs for 30 days."]).errors).toEqual(
      expect.arrayContaining([expect.stringMatching(/unverified fixed retention period/i)])
    );
  });

  it("rejects malformed or unverified entity, effective-date, contact, and inventory evidence", () => {
    const evidence: WaterCheckReleaseEvidence = {
      ...validEvidence(governedSources),
      entityName: "UNRESOLVED",
      contactPath: "mailto:unknown@example.com",
      effectiveDate: "soon",
      deploymentInventoryApprovedAt: null,
    };
    expect(validateWaterCheckRelease(evidence, governedSources).errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/entity name/i),
        expect.stringMatching(/contact path/i),
        expect.stringMatching(/effective date/i),
        expect.stringMatching(/deployment inventory/i),
      ])
    );
  });
});
