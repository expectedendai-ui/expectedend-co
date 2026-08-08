import { createHash } from "node:crypto";

export type WaterCheckReleaseEvidence = {
  candidateEntityName: string;
  candidateContactPath: string;
  entityName: string | null;
  contactPath: string | null;
  effectiveDate: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  governedContentDigest: string | null;
  deploymentInventoryApprovedBy: string | null;
  deploymentInventoryApprovedAt: string | null;
};

export type WaterCheckReleaseValidation = {
  valid: boolean;
  errors: string[];
};

export const WATER_CHECK_RELEASE_EVIDENCE: WaterCheckReleaseEvidence = {
  candidateEntityName: "Expected End LLC",
  candidateContactPath: "/about#contact",
  entityName: null,
  contactPath: null,
  effectiveDate: null,
  approvedBy: null,
  approvedAt: null,
  governedContentDigest: null,
  deploymentInventoryApprovedBy: null,
  deploymentInventoryApprovedAt: null,
};

const UNRESOLVED_VALUE = /(?:^|\b)(?:pending|unresolved|tbd|todo|placeholder|insert here)(?:\b|$)/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isRealIsoDate = (value: string | null): value is string => {
  if (!value || !ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
};

const isResolvedText = (value: string | null) => Boolean(value?.trim() && !UNRESOLVED_VALUE.test(value));

export const createWaterCheckGovernedDigest = (governedSources: readonly string[]) => {
  const canonical = governedSources.map((source) => `${source.length}:${source}`).join("|");
  return `sha256:${createHash("sha256").update(canonical, "utf8").digest("hex")}`;
};

export const validateWaterCheckRelease = (
  evidence: WaterCheckReleaseEvidence,
  governedSources: readonly string[]
): WaterCheckReleaseValidation => {
  const errors: string[] = [];
  const governedCopy = governedSources.join("\n");

  if (!isResolvedText(evidence.entityName)) errors.push("An owner-approved product entity name is required.");
  if (!evidence.contactPath || !/^\/[\w./#-]*$/.test(evidence.contactPath) || UNRESOLVED_VALUE.test(evidence.contactPath)) {
    errors.push("An owner-approved internal contact path is required.");
  }
  if (!isRealIsoDate(evidence.effectiveDate)) errors.push("An owner-approved effective date in YYYY-MM-DD format is required.");
  if (!isResolvedText(evidence.approvedBy)) errors.push("The product claims and legal-copy approver is required.");
  if (!isRealIsoDate(evidence.approvedAt)) errors.push("The product claims and legal-copy approval date is required.");
  if (!isResolvedText(evidence.deploymentInventoryApprovedBy) || !isRealIsoDate(evidence.deploymentInventoryApprovedAt)) {
    errors.push("The deployment inventory requires a named approver and approval date.");
  }

  if (UNRESOLVED_VALUE.test(governedCopy)) errors.push("Governed content contains an unresolved token.");
  if (/\b(?:you (?:can|may)|we (?:will|provide))\b[^.]{0,100}\b(?:delete|deletion|export|download)\b/i.test(governedCopy)) {
    errors.push("Governed content contains an unsupported deletion or export promise.");
  }
  if (
    /\b(?:retain|retained|retention|keep|kept)\b[^.]{0,80}\b\d+\s+(?:calendar\s+)?(?:days?|months?|years?)\b/i.test(governedCopy)
  ) {
    errors.push("Governed content contains an unverified fixed retention period.");
  }

  const currentDigest = createWaterCheckGovernedDigest(governedSources);
  if (!evidence.governedContentDigest || evidence.governedContentDigest !== currentDigest) {
    errors.push("The governed-content digest is missing or does not match the current content.");
  }

  return { valid: errors.length === 0, errors };
};
