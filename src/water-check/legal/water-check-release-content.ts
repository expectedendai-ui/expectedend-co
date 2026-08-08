export type WaterCheckReleaseFacts = {
  entityName: string;
  contactPath: string;
  effectiveDate: string;
};

export type WaterCheckReleaseRecord = {
  candidates: {
    entityName: string;
    contactPath: string;
  };
  approvedContent: {
    facts: WaterCheckReleaseFacts;
    approvedBy: string;
    approvedAt: string;
    governedContentDigest: string;
  } | null;
  deploymentInventoryApproval: {
    approvedBy: string;
    approvedAt: string;
    contentDigest: string;
  } | null;
};

export type WaterCheckRenderedReleaseFacts = {
  entityName: string | null;
  contactPath: string | null;
  effectiveDate: string | null;
};

export const WATER_CHECK_PENDING_APPROVAL_LABEL = "Pending owner approval";

export const WATER_CHECK_RELEASE_RECORD: WaterCheckReleaseRecord = {
  candidates: {
    entityName: "Expected End LLC",
    contactPath: "/about#contact",
  },
  approvedContent: null,
  deploymentInventoryApproval: null,
};

export const getWaterCheckRenderedReleaseFacts = (
  releaseRecord: WaterCheckReleaseRecord
): WaterCheckRenderedReleaseFacts => ({
  entityName: releaseRecord.approvedContent?.facts.entityName ?? null,
  contactPath: releaseRecord.approvedContent?.facts.contactPath ?? null,
  effectiveDate: releaseRecord.approvedContent?.facts.effectiveDate ?? null,
});
