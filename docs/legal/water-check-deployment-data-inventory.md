# Water Check Deployment Data Inventory

Status: **unresolved — blocks hosted preview and production release**

This inventory records the deployment-layer facts needed to describe the Water Check Coming Soon website accurately. Repository review can establish what the application code intentionally does; it cannot establish the authenticated Cloudflare Pages, DNS, CDN, security, or account configuration. An authorized owner must complete the evidence fields below before approving the product privacy language.

The production release guard hashes this entire document, requires every deployment area to have a resolved evidence location and a `Verified`, `Complete`, `Approved`, or reasoned `Not applicable` status, and requires every approval-record value below to be resolved. Approval metadata alone cannot release an unresolved inventory. Any edit after approval changes the document digest and blocks release until the inventory is reviewed again.

## Application-layer observation

The reviewed Coming Soon implementation contains no form, waitlist, account flow, health or demographic input, product-scan upload, AI chat, payment flow, Water Check analytics integration, advertising integration, or intentional cookie/local-storage/session-storage write. Store controls update an in-page status only. The optional Instagram link sends a request to Instagram only after a visitor activates it.

These observations do not prove that the deployment platform performs no operational request processing.

## Required authenticated deployment evidence

| Area | Facts to verify | Evidence location or capture | Status |
| --- | --- | --- | --- |
| Hosting and CDN services | Cloudflare account, Pages project, production and preview domains, DNS/proxy mode, and enabled delivery products | Owner-supplied dashboard export or dated screenshots | Unresolved |
| Request and log fields | Every request, access, security, diagnostic, and error-log field, including network address, path/query, headers, device/browser detail, timestamps, location inference, identifiers, and event outcome | Product configuration and sample/schema evidence with sensitive values redacted | Unresolved |
| Purposes and system owners | Purpose for each field or log and the internal owner responsible for the configuration | Owner-approved field map | Unresolved |
| Authorized access | Roles, people, service accounts, and support access able to view or export each record | Access-control export or dated screenshots | Unresolved |
| Recipients and subprocessors | Services and parties receiving each datum, including routing, security, logging, support, or diagnostic providers | Account configuration and applicable service documentation | Unresolved |
| Protection | Transport, access-control, credential, logging, and other verified protections for operational records | Configuration evidence | Unresolved |
| Retention and deletion | Actual configured retention or deletion rule for every operational record, including whether the value is configurable | Dated settings evidence; do not infer from a vendor marketing page | Unresolved |
| Cookies and browser storage | Every host-, CDN-, security-, or application-set cookie, local-storage item, session-storage item, cache identifier, or other client-side state | Clean-profile browser capture plus authenticated configuration | Unresolved |
| Response headers | Production and preview response headers, including caching, security, reporting, and cookie headers | Raw response capture for the homepage and every nested Water Check route | Unresolved |
| Nonessential behavior | Analytics, browser insights, telemetry, session replay, advertising, experiments, and similar optional products; record that each is disabled or document and approve it | Product toggles and clean-profile network capture | Unresolved |

## Route and environment coverage

Evidence must cover direct navigation and refresh for:

- `/thewatercheck`
- `/thewatercheck/privacy`
- `/thewatercheck/terms`
- `/thewatercheck/health-and-ai-disclaimer`
- `/thewatercheck/consumer-health-data`

Record the named non-production preview environment separately from production when their settings differ. Local Vite behavior is not deployment evidence.

## Approval record

| Field | Approved value |
| --- | --- |
| Deployment inventory approver | Unresolved |
| Approval date | Unresolved |
| Evidence capture date | Unresolved |
| Pages project and account confirmed | Unresolved |
| Inventory version or attachment digest | Unresolved |
| Privacy copy reconciled to this inventory | Unresolved |

Any later hosting, security, logging, analytics, cookie, storage, domain, or retention configuration change requires this inventory and the governed-content approval digest to be reviewed again.
