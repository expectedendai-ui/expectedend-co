import { createHash } from "node:crypto";
import {
  WATER_CHECK_RELEASE_RECORD,
  type WaterCheckReleaseRecord,
  type WaterCheckRenderedReleaseFacts,
} from "./water-check-release-content";

export type WaterCheckReleaseEvidence = WaterCheckReleaseRecord;

export type WaterCheckReleaseArtifacts = {
  governedSources: readonly string[];
  renderedFacts: WaterCheckRenderedReleaseFacts;
  deploymentInventoryDocument: string;
};

export type WaterCheckReleaseValidation = {
  valid: boolean;
  errors: string[];
};

export const WATER_CHECK_RELEASE_EVIDENCE = WATER_CHECK_RELEASE_RECORD;

const UNRESOLVED_VALUE = /(?:^|\b)(?:pending|unresolved|tbd|todo|placeholder|insert here)(?:\b|$)/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const COMPLETED_INVENTORY_STATUS = /^(?:approved|complete|verified)(?:\b|$)|^not applicable\b.+/i;

const REQUIRED_INVENTORY_AREAS = [
  "Hosting and CDN services",
  "Request and log fields",
  "Purposes and system owners",
  "Authorized access",
  "Recipients and subprocessors",
  "Protection",
  "Retention and deletion",
  "Cookies and browser storage",
  "Response headers",
  "Nonessential behavior",
] as const;

const REQUIRED_INVENTORY_APPROVAL_FIELDS = [
  "Deployment inventory approver",
  "Approval date",
  "Evidence capture date",
  "Pages project and account confirmed",
  "Inventory version or attachment digest",
  "Privacy copy reconciled to this inventory",
] as const;

const isRealIsoDate = (value: string | null): value is string => {
  if (!value || !ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
};

const isResolvedText = (value: string | null | undefined): value is string =>
  Boolean(value?.trim() && !UNRESOLVED_VALUE.test(value));

const readMarkdownTableRow = (document: string, label: string) => {
  const row = document
    .split(/\r?\n/)
    .find((line) => line.trimStart().startsWith(`| ${label} |`));
  return row?.split("|").slice(1, -1).map((cell) => cell.trim()) ?? null;
};

const getInventoryErrors = (
  document: string,
  approval: WaterCheckReleaseRecord["deploymentInventoryApproval"]
) => {
  const errors: string[] = [];
  const documentStatus = document.match(/^Status:\s*(.+)$/im)?.[1].replaceAll("*", "").trim();

  if (!documentStatus || !COMPLETED_INVENTORY_STATUS.test(documentStatus)) {
    errors.push("The deployment inventory status must be explicitly approved, complete, or verified.");
  }

  for (const area of REQUIRED_INVENTORY_AREAS) {
    const row = readMarkdownTableRow(document, area);
    const evidenceLocation = row?.[2];
    const status = row?.[3];
    if (!isResolvedText(evidenceLocation) || !status || !COMPLETED_INVENTORY_STATUS.test(status)) {
      errors.push(`The deployment inventory area \"${area}\" is missing resolved evidence and status.`);
    }
  }

  for (const field of REQUIRED_INVENTORY_APPROVAL_FIELDS) {
    const value = readMarkdownTableRow(document, field)?.[1];
    if (!isResolvedText(value)) {
      errors.push(`The deployment inventory approval field \"${field}\" is unresolved.`);
    }
  }

  if (!approval) {
    errors.push("The deployment inventory requires content-bound approval evidence.");
    return errors;
  }

  if (!isResolvedText(approval.approvedBy) || !isRealIsoDate(approval.approvedAt)) {
    errors.push("The deployment inventory requires a named approver and approval date.");
  }

  const documentApprover = readMarkdownTableRow(document, "Deployment inventory approver")?.[1];
  const documentApprovalDate = readMarkdownTableRow(document, "Approval date")?.[1];
  if (documentApprover !== approval.approvedBy || documentApprovalDate !== approval.approvedAt) {
    errors.push("The deployment inventory approver or approval date does not match the approved document.");
  }

  const currentDigest = createWaterCheckDeploymentInventoryDigest(document);
  if (!approval.contentDigest || approval.contentDigest !== currentDigest) {
    errors.push("The deployment-inventory digest is missing or does not match the current document.");
  }

  return errors;
};

export const createWaterCheckGovernedDigest = (governedSources: readonly string[]) => {
  const canonical = governedSources.map((source) => `${source.length}:${source}`).join("|");
  return `sha256:${createHash("sha256").update(canonical, "utf8").digest("hex")}`;
};

export const createWaterCheckDeploymentInventoryDigest = (document: string) =>
  `sha256:${createHash("sha256").update(document, "utf8").digest("hex")}`;

export const validateWaterCheckRelease = (
  evidence: WaterCheckReleaseEvidence,
  artifacts: WaterCheckReleaseArtifacts
): WaterCheckReleaseValidation => {
  const errors: string[] = [];
  const governedSources = [...artifacts.governedSources, JSON.stringify(artifacts.renderedFacts)];
  const governedCopy = governedSources.join("\n");
  const approvedContent = evidence.approvedContent;

  if (!approvedContent) {
    errors.push("Owner-approved product legal facts and content approval are required.");
  } else {
    const { facts } = approvedContent;
    if (!isResolvedText(facts.entityName)) errors.push("An owner-approved product entity name is required.");
    if (!/^\/[\w./#-]*$/.test(facts.contactPath) || UNRESOLVED_VALUE.test(facts.contactPath)) {
      errors.push("An owner-approved internal contact path is required.");
    }
    if (!isRealIsoDate(facts.effectiveDate)) {
      errors.push("An owner-approved effective date in YYYY-MM-DD format is required.");
    }
    if (!isResolvedText(approvedContent.approvedBy)) {
      errors.push("The product claims and legal-copy approver is required.");
    }
    if (!isRealIsoDate(approvedContent.approvedAt)) {
      errors.push("The product claims and legal-copy approval date is required.");
    }
    if (
      artifacts.renderedFacts.entityName !== facts.entityName ||
      artifacts.renderedFacts.contactPath !== facts.contactPath ||
      artifacts.renderedFacts.effectiveDate !== facts.effectiveDate
    ) {
      errors.push("The rendered entity, contact path, or effective date does not match the owner-approved legal facts.");
    }

    const currentDigest = createWaterCheckGovernedDigest(governedSources);
    if (!approvedContent.governedContentDigest || approvedContent.governedContentDigest !== currentDigest) {
      errors.push("The governed-content digest is missing or does not match the current content.");
    }
  }

  errors.push(...getInventoryErrors(artifacts.deploymentInventoryDocument, evidence.deploymentInventoryApproval));

  if (!artifacts.governedSources.includes(artifacts.deploymentInventoryDocument)) {
    errors.push("The deployment inventory document must be included in the governed-content sources.");
  }

  if (UNRESOLVED_VALUE.test(governedCopy)) errors.push("Governed content contains an unresolved token.");
  if (/\b(?:you (?:can|may)|we (?:will|provide))\b[^.]{0,100}\b(?:delete|deletion|export|download)\b/i.test(governedCopy)) {
    errors.push("Governed content contains an unsupported deletion or export promise.");
  }
  if (
    /\b(?:retain|retained|retention|keep|kept)\b[^.]{0,80}\b\d+\s+(?:calendar\s+)?(?:days?|months?|years?)\b/i.test(
      governedCopy
    )
  ) {
    errors.push("Governed content contains an unverified fixed retention period.");
  }

  return { valid: errors.length === 0, errors };
};
