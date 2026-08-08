# Water Check Deployment Data Inventory

Status: **Approved**

This inventory records the production facts reviewed for the Water Check Coming Soon website on August 8, 2026. It covers the repository build, an authenticated Cloudflare Pages project inspection, public DNS, current production response headers, Cloudflare's published service documentation, and a clean-profile browser capture of the release build. Denzel Rigaud approved this inventory for Expected End LLC on August 8, 2026.

The release guard hashes this entire document and the governed public copy. Any later hosting, security, logging, analytics, cookie, storage, domain, or retention change requires a new review and approval.

## Application-layer observation

The reviewed release contains no form, waitlist, account flow, health or demographic input, product-scan upload, AI chat, payment flow, app-download control, Water Check analytics integration, advertising integration, or intentional cookie, local-storage, or session-storage write. Instagram and LinkedIn are ordinary links; a request to either service occurs only after a visitor activates its link.

A clean browser profile loaded `/thewatercheck` from the production build and made eight same-origin document, script, style, font, and image requests. It made no third-party request, set no cookie, created no local-storage or session-storage item, and produced no browser warning or error.

## Deployment inventory

| Area | Verified facts | Evidence location or capture | Status |
| --- | --- | --- | --- |
| Hosting and CDN services | Cloudflare Pages project `expectedend-co` serves `expectedend-co.pages.dev`, `expectedend.co`, and `www.expectedend.co`; `main` is the production branch. The active full Cloudflare zone delegates to two Cloudflare nameservers. Production and preview use the same compatibility date and have no compatibility flags. | Evidence E1 | Verified |
| Request and log fields | Cloudflare processes requests at its edge, including IP address, traffic-routing data, requested host and path, request and response headers, timestamps, system configuration, and security/network signals. Cloudflare may derive request-volume, error, cache, availability, and threat metrics. The static application does not receive those fields in a Function or app database. | Evidence E2 | Verified |
| Purposes and system owners | Cloudflare processes operational traffic to route, cache, deliver, protect, and troubleshoot the website. Expected End LLC owns the site configuration and uses only the delivery and security functions needed for this static release. No health profiling or personalized advertising purpose is enabled. | Evidence E3 | Approved |
| Authorized access | The authenticated owner membership is active. Cloudflare account administrators can manage project configuration and view provider-supplied operational metrics or audit records; Cloudflare and its controlled service providers operate the delivery service. The release has no site account, database, log export, or customer-support console containing visitor submissions. | Evidence E4 | Verified |
| Recipients and subprocessors | Initial page load sends requests only to the Expected End origin as delivered by Cloudflare. Cloudflare is the hosting, CDN, DNS, and security provider and may use service providers under its privacy and contractual controls. Instagram and LinkedIn receive a request only after an intentional click. | Evidence E5 | Verified |
| Protection | Public traffic uses HTTPS through Cloudflare's active network. Account access requires authenticated Cloudflare credentials; deployment uses scoped OAuth authorization. The response includes `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`. There is no application database or secret-bearing runtime binding in production or preview. | Evidence E6 | Verified |
| Retention and deletion | The release has no Pages Function, application log store, database, browser-storage record, or Logpush destination. Cloudflare documents that live Pages Function tail logs are streamed rather than stored; no Function exists in this release. Cloudflare controls provider operational-data retention under its published purpose- and obligation-based policy, and controls administrative audit-log deletion under its published schedule. Expected End LLC has no app-level visitor record or fixed visitor-log setting to delete. | Evidence E7 | Verified |
| Cookies and browser storage | Clean-profile inspection of the built page found no cookies, local-storage items, or session-storage items. Current production header captures for the homepage and every Water Check route contained no `Set-Cookie`. Cloudflare adds Network Error Logging response directives, which can send a diagnostic report to Cloudflare when the browser encounters a qualifying network event. | Evidence E8 | Verified |
| Response headers | All inspected production routes returned HTTP 200 with HTML content, `Cache-Control: public, max-age=0, must-revalidate`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, Cloudflare server/cache headers, and Cloudflare `NEL`/`Report-To` directives. No `Set-Cookie` or Content-Security-Policy header was present in the capture. | Evidence E9 | Verified |
| Nonessential behavior | Cloudflare Web Analytics beacon injection is disabled, and the built document contains no analytics beacon, advertising pixel, tag manager, session replay, chat widget, social embed, experiment SDK, or remote font. Clean-profile capture showed no third-party request before a user-selected outbound navigation. Cloudflare's inherent edge delivery/security metrics remain operational processing, not a Water Check behavioral-profile feature. | Evidence E10 | Verified |

## Evidence record

### E1 — Authenticated project and public DNS

- Authenticated Cloudflare API and Wrangler capture on August 8, 2026 confirmed project `expectedend-co`, its three domains, production branch `main`, and successful direct-upload production deployments.
- Production and preview each reported zero environment variables and zero KV, D1, R2, Durable Object, and service bindings.
- Public DNS returned Cloudflare nameservers and Cloudflare anycast addresses for `expectedend.co`.

### E2 — Provider request-data documentation

- Cloudflare Privacy Policy, “End Users” and “Network Data”: https://www.cloudflare.com/privacypolicy/
- Cloudflare HTTP headers reference: https://developers.cloudflare.com/fundamentals/reference/http-headers/
- The application build contains no Pages Function or server-side request handler.

### E3 — Purpose and owner map

- Owner-approved purpose map in the deployment inventory table above.
- Repository review found no health-input, account, analytics, advertising, or personalization endpoint on this website.

### E4 — Access review

- Authenticated Cloudflare membership capture on August 8, 2026 confirmed the current owner's accepted account membership and scoped Pages deployment authorization.
- Repository and project-config review confirmed no site-side identity system, runtime secret, database, or visitor-log export.

### E5 — Recipient review

- Clean-profile request capture showed only the same-origin page and local assets before intentional outbound navigation.
- Cloudflare Privacy Policy, “Information Sharing”: https://www.cloudflare.com/privacypolicy/

### E6 — Protection review

- HTTPS production response capture on August 8, 2026.
- Authenticated project configuration and OAuth-scope inspection.
- No application database or runtime binding is attached to either deployment environment.

### E7 — Retention review

- Cloudflare Pages Functions logging limits state that live tail logs are not stored: https://developers.cloudflare.com/pages/functions/debugging-and-logging/#limits
- Cloudflare Privacy Policy, “Data Retention”: https://www.cloudflare.com/privacypolicy/
- Cloudflare account audit-log retention documentation: https://developers.cloudflare.com/fundamentals/account/account-security/audit-logs/#retention
- No Pages Function, custom log export, or app data store exists for this release.

### E8 — Cookie and browser-storage capture

- Isolated Chromium session against the release build on August 8, 2026: no cookies, local storage, or session storage after initial load.
- Production response captures for `/`, `/thewatercheck`, and all four nested legal routes: no `Set-Cookie` header.

### E9 — Route response capture

Evidence covered direct requests to:

- `/`
- `/thewatercheck`
- `/thewatercheck/privacy`
- `/thewatercheck/terms`
- `/thewatercheck/health-and-ai-disclaimer`
- `/thewatercheck/consumer-health-data`

All routes returned HTTP 200 through Cloudflare. Preview and production use the same project configuration; the final deployment is verified again after upload.

### E10 — Nonessential-service review

- Authenticated Pages inspection and production HTML review found no enabled Cloudflare Web Analytics beacon.
- Static source and clean-profile network review found no analytics, advertising, replay, chat, social-widget, experiment, or remote-font request.

## Approval record

| Field | Approved value |
| --- | --- |
| Deployment inventory approver | Denzel Rigaud |
| Approval date | 2026-08-08 |
| Evidence capture date | 2026-08-08 |
| Pages project and account confirmed | Yes — authenticated `expectedend-co` production and preview configuration |
| Inventory version or attachment digest | water-check-deployment-inventory-v1-2026-08-08 |
| Privacy copy reconciled to this inventory | Yes — 2026-08-08 |

Any later hosting, security, logging, analytics, cookie, storage, domain, or retention configuration change requires this inventory and the governed-content approval digest to be reviewed again.
