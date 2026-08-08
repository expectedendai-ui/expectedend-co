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
  approvedContent: {
    facts: {
      entityName: "Expected End LLC",
      contactPath: "/about#contact",
      effectiveDate: "2026-08-08",
    },
    approvedBy: "Denzel Rigaud",
    approvedAt: "2026-08-08",
    governedContentDigest: "sha256:0d2013f399dd69fcf5906c7ff1c08d25988d883a20df4371d5945d187f497d16",
  },
  deploymentInventoryApproval: {
    approvedBy: "Denzel Rigaud",
    approvedAt: "2026-08-08",
    contentDigest: "sha256:90425897ed33f71e099d6f8fcb8f03a53b17688def04bfe4978d611a36ded5a3",
  },
};

export const getWaterCheckRenderedReleaseFacts = (
  releaseRecord: WaterCheckReleaseRecord
): WaterCheckRenderedReleaseFacts => ({
  entityName: releaseRecord.approvedContent?.facts.entityName ?? null,
  contactPath: releaseRecord.approvedContent?.facts.contactPath ?? null,
  effectiveDate: releaseRecord.approvedContent?.facts.effectiveDate ?? null,
});
