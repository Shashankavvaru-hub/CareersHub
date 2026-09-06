---
trigger: always_on
---

# Project Context Rules

## 1. Project Identity

* Project name: **Whitecarrot Careers Page Builder**
* Project type: **Multi-tenant Careers Page Builder MVP**
* Primary users:

  * Recruiters / company users
  * Candidates / public visitors
* Primary objective:

  * Allow recruiters to create, customize, preview, save, and publish branded careers pages.
  * Allow candidates to view published careers pages and browse available jobs.
* The application is part of an ATS-oriented product ecosystem.
* The MVP does not implement the candidate application workflow.

## 2. Product Goal

The system allows a company/recruiter to create a public careers page containing:

* Company branding.
* Company information.
* Culture/life-at-company content.
* Optional custom content sections.
* Available jobs.
* Job search/filtering.
* External application links.

The candidate-facing experience must provide a clean, responsive, accessible, SEO-friendly public careers page.

## 3. User Roles

### Recruiter

A recruiter is an authenticated company user who can manage the careers page for their authorized company.

Recruiter capabilities include:

* Access the careers-page builder.
* Configure company branding.
* Configure page content.
* Add supported content sections.
* Remove supported content sections.
* Reorder sections.
* Preview the page.
* Save a draft.
* Publish the page.
* Access the public careers-page URL.

### Candidate

A candidate is an unauthenticated public visitor.

Candidates can:

* Open a published careers page.
* View company information.
* View published careers content.
* Browse available jobs.
* Search jobs by title.
* Filter jobs by location.
* Filter jobs by job type.
* Open an external application URL.

Candidates do not create accounts in the MVP.

Candidates do not submit applications through this application.

## 4. Multi-Tenant Model

The application is multi-tenant.

The primary tenant is the **company**.

A company owns its:

* Careers page.
* Careers page configuration.
* Page sections.
* Published revisions.
* Jobs.
* Media references.
* Branding/content.

Authenticated users are associated with companies through company membership.

All recruiter-side company data must be tenant-scoped.

A recruiter must never be able to read or modify another company's data.

## 5. Careers Page Builder

The builder is the primary recruiter-facing feature.

The builder allows the recruiter to configure:

* Company branding.
* Primary colors.
* Logo.
* Banner/hero content.
* Culture video.
* Page sections.
* Section ordering.
* Section content.

The builder must support:

* Add section.
* Remove section.
* Reorder section.
* Edit section.
* Save draft.
* Preview draft.
* Publish.

The builder must not become a general-purpose website builder.

## 6. Supported Section Types

The MVP supports a fixed set of section types.

Supported types:

```text
about
life_at_company
custom_text
jobs
```

Do not introduce arbitrary block types unless explicitly requested.

### About

Used for company/about information.

### Life at Company

Used for company culture and employee experience content.

### Custom Text

Used for recruiter-provided custom content.

### Jobs

Displays available jobs.

The jobs section must use the application's job data model.

## 7. Section Constraints

The page builder must enforce the documented MVP limits.

Current limits include:

* Maximum sections per page: **10**
* Section title maximum: **120 characters**
* Section content maximum: **2000 characters**
* Rich text must remain limited and controlled.

Do not introduce an unrestricted HTML editor.

Do not allow arbitrary scripts, embeds, or unsafe HTML.

## 8. Branding

Recruiters can configure page branding.

Supported branding includes:

* Company logo.
* Primary colors.
* Banner/hero image.
* Relevant company visual content.
* Culture video.

Branding must be applied consistently across the public page.

Branding values must be validated before persistence.

Invalid color values, malformed URLs, unsafe media, and unsupported content must be rejected.

## 9. Logo Rules

Supported logo formats:

* PNG
* JPG/JPEG
* SVG

SVG content must be safely sanitized before being served.

Maximum logo size:

* **2 MB**

Where possible, optimized formats such as WebP may be generated/used for delivery.

Do not trust client-side file validation.

All important media restrictions must be enforced server-side.

## 10. Banner Rules

Supported banner formats:

* PNG
* JPG/JPEG
* WebP

Maximum banner size:

* **5 MB**

Recommended banner dimensions:

* approximately **1920 × 600**

The application must not require the exact recommended dimensions.

Images should be optimized for public delivery.

## 11. Culture Video

The MVP supports externally hosted culture videos.

Approved providers:

* YouTube
* Vimeo

Do not implement arbitrary video hosting for the MVP.

Do not autoplay culture videos.

Video content should be lazy-loaded where practical.

Validate the provider and URL server-side.

Do not allow arbitrary iframe/embed URLs.

## 12. Jobs

The MVP uses seeded/admin-managed job data.

Recruiters do not receive full job CRUD functionality in the MVP.

Jobs contain the information required for the public careers page, including relevant:

* Title.
* Location.
* Job type.
* Description/details.
* External application URL.

Jobs are displayed through the careers page.

Candidates can:

* Search by job title.
* Filter by location.
* Filter by job type.
* Open the external application URL.

## 13. External Application Flow

The careers page does not process applications.

The application flow is:

```text
Candidate
    ↓
Public Careers Page
    ↓
Job
    ↓
Apply
    ↓
External application URL
```

Do not build:

* Candidate accounts.
* Resume upload.
* Application forms.
* Application tracking.
* Candidate profiles.
* Internal application submission.
* Recruiter applicant management.

## 14. Draft and Published State

The careers page has a clear distinction between:

```text
Draft
Published
```

Recruiters work on draft content.

Candidates only see published content.

Draft changes must never accidentally become public.

The public page must never read draft state.

## 15. Publishing Model

Publishing creates/activates a published revision representing the page state.

The public page reads the currently published revision.

Publishing must:

* Validate the draft.
* Persist the publish operation correctly.
* Ensure the new published revision is complete.
* Ensure only the intended revision becomes active.
* Trigger required cache invalidation.

A failed publish must not leave the public page in a partially updated state.

## 16. Public URL Model

Public careers pages use company slugs.

The URL model is conceptually:

```text
/careers/{company-slug}
```

The exact routing implementation must follow the project's architecture.

MVP does not support:

* Custom domains.
* Multiple custom careers URLs.
* Domain mapping.

Unknown, inactive, or unpublished slugs must return the documented generic 404 behavior.

Do not expose whether a hidden/unpublished company exists.

## 17. Public Page Data Boundary

Public pages may only consume data that is explicitly intended for public exposure.

The public layer must not return:

* Recruiter information.
* Internal company identifiers unless intentionally exposed.
* Draft content.
* Private media.
* Internal permissions.
* Authentication data.
* Internal operational metadata.

The public page should consume a public-safe representation of the published page.

## 18. Public Page Rendering

Public careers pages should be server-rendered where appropriate.
The goal is to provide:
* Crawlable content.
* Good initial rendering.
* Good SEO.
* Good mobile performance.
* Minimal client-side JavaScript.

Do not convert the entire public careers page into a client-only application unnecessarily.

Client-side JavaScript should primarily support interactive functionality such as:
* Job filtering.
* Search.
* UI interactions.

## 19. Candidate Experience

The candidate-facing page should prioritize:

1. Company identity.
2. Clear company content.
3. Available jobs.
4. Easy job discovery.
5. Clear job information.
6. Clear application action.

Candidates should not need an account to browse jobs.

The public page must work without recruiter authentication.

## 20. Recruiter Experience

The recruiter experience should prioritize:

1. Simple page customization.
2. Clear editing controls.
3. Predictable ordering.
4. Preview before publishing.
5. Explicit save behavior.
6. Explicit publish behavior.
7. Clear success/error feedback.

Do not hide important publishing behavior behind ambiguous controls.

## 21. Preview

Preview should represent the current recruiter-edited state.

Preview must not accidentally publish the page.

Where possible, preview behavior should share rendering logic with the public page while maintaining the correct draft/public data boundary.

## 22. SEO

Public careers pages are intended to be discoverable by search engines.

The public page should provide:

* Appropriate title.
* Meta description.
* Canonical URL.
* Crawlable page content.
* Job-related structured data where applicable.
* Correct heading hierarchy.

Essential content must not depend entirely on client-side rendering.

## 23. Accessibility

The product targets:

**WCAG 2.2 AA**

Core recruiter and candidate flows should support:

* Keyboard navigation.
* Visible focus.
* Semantic HTML.
* Accessible form labels.
* Screen-reader-friendly controls.
* Sufficient contrast.
* Meaningful error messages.
* Responsive layouts.

Core flows should be manually checked with:

* Keyboard navigation.
* NVDA where available.
* VoiceOver where available.

## Responsive Design

The application is **mobile-first**.
Mobile is the primary design and interaction target.
The application must support:
- Mobile devices.
- Tablets.
- Desktop browsers.

Implementation order should generally be:
```text
Mobile
 ↓
Tablet
  ↓
Desktop

## 25. Performance Targets

The application should aim for the approved performance targets:
* Public page TTI: **< 2.5 seconds on a mid-range mobile device over 4G**
* Core Web Vitals: **Good at the 75th percentile**
* API p95 latency: **< 300 ms**
Performance decisions must not compromise correctness, security, or accessibility.

## 26. Caching

Public careers pages are read-heavy.
Published public content should be suitable for caching/CDN delivery.
Publishing must invalidate or refresh relevant cached content.
Draft recruiter content must not leak through public caches.
Cache keys must correctly account for the public company/page identity.

## 27. Media Delivery

Media should use:

```text
Object Storage
      ↓
CDN
      ↓
Public Page
```

Do not serve large media directly from application servers when the approved architecture provides object storage/CDN.

Do not expose private storage credentials.

## 28. Security Context

The system must protect against common application threats including:
* Cross-tenant data access.
* Broken authorization.
* XSS.
* SQL injection.
* CSRF where applicable.
* SSRF.
* Open redirects.
* Unsafe file uploads.
* Malicious SVG content.
* Unauthorized publishing.
* Data leakage.

Security checks must be performed server-side.

## 29. Data Retention

Deactivated company data is retained for the approved retention period.

Current policy:

* Retain deactivated company data for **90 days**.
* After the retention period, the data becomes eligible for deletion.

Do not implement destructive deletion behavior that conflicts with this policy.

## 30. Analytics

Analytics are **not part of the MVP**.

Do not implement:

* Candidate analytics.
* Page-view dashboards.
* Application click analytics.
* Recruiter analytics.
* Custom tracking systems.
Analytics may be documented as future scope.

## 31. Final Context Rule

The Careers Page Builder is a focused multi-tenant MVP, not a full ATS 