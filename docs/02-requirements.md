# Requirements

## 1. Purpose

This document defines the functional and non-functional requirements for the Whitecarrot Careers Page Builder MVP.

The MVP enables recruiters to create and publish branded Careers pages and enables candidates to browse open jobs from those pages.

The job application process itself is outside the MVP scope.

---

# 2. User Roles

## 2.1 Recruiter

Recruiters configure and manage their company's Careers page.

They must be able to:

* Log in.
* Access their company's page editor.
* Customize branding.
* Manage page sections.
* Save drafts.
* Preview drafts.
* Publish pages.
* Access/share the public Careers URL.

## 2.2 Candidate

Candidates are public, unauthenticated visitors.

They must be able to:

* Visit a company's Careers page.
* Learn about the company.
* Browse open jobs.
* Search jobs by title.
* Filter jobs by location.
* Filter jobs by job type.
* Navigate to an external application URL.

## 2.3 Platform Administrator

Platform administrators support the multi-tenant system.

For MVP they may:

* Create/manage companies.
* Assign and change company slugs.
* Deactivate companies.
* Manage/seed job data.

---

# 3. Recruiter Requirements

## R-001 Authentication

Recruiters must be able to authenticate through a managed authentication system.

Unauthenticated users must not access protected recruiter functionality.

## R-002 Company Editor

An authorized recruiter must be able to access:

```text
/{company-slug}/edit
```

Only users authorized for that company may modify its data.

## R-003 Branding

The recruiter must be able to configure:

* Primary brand color.
* Secondary brand color.
* Company logo.
* Hero/banner image.
* Hero headline.
* Hero subtext.
* Optional CTA.
* Culture video.

The hero/banner may support:

* Background image.
* Overlay color.
* Overlay opacity.
* Headline.
* Subtext.
* CTA button.

## R-004 Logo

The recruiter must be able to upload a company logo.

Uploads must follow the project's media validation and security requirements.

## R-005 Culture Video

The recruiter must be able to configure a culture video using an approved YouTube or Vimeo URL.

Arbitrary video providers must not be accepted.

## R-006 Content Sections

The builder must support these fixed section types:

```text
about
life_at_company
custom_text
jobs
```

The recruiter must be able to:

* Add sections.
* Remove sections.
* Reorder sections.
* Edit section content.

The `jobs` section renders available jobs.

## R-007 Draft Saving

Recruiter changes must be saveable as a draft.

Draft changes must not automatically become publicly visible.

## R-008 Preview

The recruiter must be able to preview the current draft at:

```text
/{company-slug}/preview
```

Preview must not publish the draft.

## R-009 Publishing

The recruiter must be able to explicitly publish a valid draft.

Only one published revision may be active at a time.

Candidates must see only the published revision.

## R-010 Public URL

The recruiter must be able to access and share:

```text
/{company-slug}/careers
```

---

# 4. Candidate Requirements

## R-011 Public Careers Page

Candidates must be able to access:

```text
/{company-slug}/careers
```

without authentication.

The page must display the company's published:

* Branding.
* Hero/banner.
* Content sections.
* Available jobs.

## R-012 Job Browsing

Candidates must be able to browse open jobs.

Closed/inactive jobs must not appear as available jobs.

## R-013 Job Search

Candidates must be able to search jobs by **job title**.

Search behavior must be understandable and usable on mobile.

## R-014 Location Filter

Candidates must be able to filter jobs by location.

## R-015 Job Type Filter

Candidates must be able to filter jobs by job type.

## R-016 Filter Reset

Candidates must be able to clear/reset active filters.

## R-017 No Results

When no jobs match the current search/filter criteria, display a clear empty state with a way to reset the filters.

## R-018 External Application

Candidates must be able to navigate from a job to its external:

```text
application_url
```

The system does not collect or manage the application.

---

# 5. Platform Requirements

## R-019 Company Management

Platform administrators must be able to create/manage companies and assign slugs.

## R-020 Slug Management

Platform administrators may change company slugs.

Recruiters must not be allowed to change their company's slug.

## R-021 Company Deactivation

Platform administrators must be able to deactivate a company.

Deactivated companies must not have publicly accessible Careers pages.

## R-022 Tenant Isolation

Each company's data must be stored and accessed separately through enforced tenant boundaries.

A recruiter must never access another company's protected data.

---

# 6. Content Requirements

## R-023 Section Ordering

Section order must be explicitly stored and preserved.

The public page must render sections in the published order.

## R-024 Rich Text

Custom content may support limited rich-text formatting.

User-provided rich text must be sanitized before rendering.

## R-025 Content Limits

The application must enforce the approved limits for:

* Page sections.
* Section titles.
* Section content.
* Uploaded media.

Limits must be enforced server-side.

## R-026 Public Content

Only content belonging to the active published revision may be publicly rendered.

Draft content must never leak into public pages.

---

# 7. Job Requirements

## R-027 Job Source

For MVP, jobs are seeded/admin-managed using the supplied sample data.

## R-028 Job Data

A job should contain the information required by the Careers experience, including:

* Status.
* Title.
* Description.
* Location(s).
* Job type.
* Department.
* External application URL.

## R-029 Job Visibility

Jobs with the appropriate open status are displayed publicly.

Closed jobs are hidden.

## R-030 No Recruiter Job CRUD

Recruiter job creation/editing/deletion is not required for MVP.

## R-031 No Internal Application Flow

The system must not implement:

* Candidate application submission.
* Resume upload for applications.
* Candidate profiles.
* Application records.
* Screening.
* Interview management.

---

# 8. Responsive Requirements

## R-032 Mobile-First

The entire application must be designed and implemented **mobile-first**.

Mobile is a primary experience, not a secondary responsive state.

## R-033 Responsive Layout

The application must work across:

* Mobile.
* Tablet.
* Desktop.

The public Careers page must remain usable at small viewport sizes.

## R-034 Touch Interaction

Important controls must be comfortable to use through touch.

Avoid interactions that depend exclusively on:

* Hover.
* Precise pointer movement.
* Desktop-only layouts.

---

# 9. Accessibility Requirements

## R-035 Accessibility Standard

Target **WCAG 2.2 AA**.

## R-036 Accessible Interaction

Core workflows must support:

* Keyboard navigation.
* Visible focus.
* Semantic HTML.
* Accessible form labels.
* Screen-reader-friendly controls.
* Appropriate color contrast.

Accessibility must be considered during implementation rather than only at the end.

---

# 10. SEO Requirements

## R-037 Crawlable Content

Public Careers pages must expose essential content through crawlable HTML.

## R-038 Metadata

Public pages must provide appropriate metadata.

## R-039 Structured Data

Public Careers pages should include appropriate JSON-LD structured data, including:

* `Organization`.
* `JobPosting`.

## R-040 Public URLs

Public Careers URLs must be stable and based on the company slug.

---

# 11. PWA Requirements

## R-041 PWA Compatibility

The frontend architecture must remain compatible with the project's PWA direction.

The application should not make unnecessary decisions that prevent future:

* Installability.
* Service worker support.
* App-like mobile behavior.

## R-042 MVP PWA Scope

Complex offline synchronization and offline-first architecture are not required for MVP.

PWA capabilities must not compromise:

* SEO.
* Accessibility.
* Security.
* Normal browser behavior.

---

# 12. Security Requirements

## R-043 Server-Side Authorization

All protected operations must verify authorization server-side.

Client-side permission checks are not sufficient.

## R-044 Tenant Authorization

Company membership and required permissions must be verified before accessing or modifying tenant-owned resources.

## R-045 Input Validation

All external input must be validated server-side.

## R-046 Content Security

The application must protect against relevant risks including:

* XSS.
* SQL injection.
* SSRF.
* Open redirects.
* Unsafe file uploads.
* Unauthorized tenant access.

## R-047 Secrets

Secrets, credentials, authentication tokens, and storage credentials must remain server-side.

---

# 13. Performance Requirements

The application should prioritize:

* Fast public Careers pages.
* Efficient database queries.
* Appropriate caching.
* CDN media delivery.
* Optimized images.
* Small client bundles.
* Minimal unnecessary JavaScript.

Public pages are expected to be read-heavy and should be designed accordingly.

---

# 14. Data and Publishing Requirements

## R-048 Draft/Published Separation

Draft and published state must be explicitly separated.

```text
Draft
  ↓
Validate
  ↓
Publish
  ↓
Published Revision
  ↓
Public Page
```

## R-049 Atomic Publishing

Publishing must not leave the system in a partially published state.

Where multiple database writes are required, the operation must be atomic.

## R-050 Public Data Boundary

Public requests may access only public, published data.

They must never receive draft or private recruiter data.

---

# 15. Error and State Requirements

The application must intentionally handle:

* Loading states.
* Success states.
* Validation errors.
* Authorization failures.
* Not-found states.
* Empty job results.
* Failed saves.
* Failed publishing.
* Failed media uploads.

User-facing errors must be understandable and must not expose internal implementation details.

---

# 16. PWA and Product UX Principle

The product must provide a consistent experience across mobile, tablet, and desktop while remaining compatible with future PWA capabilities.

Mobile usability, accessibility, and performance are core requirements rather than optional enhancements.

---

# 17. MVP Boundaries

The following are explicitly outside the MVP:

* Custom domains.
* Advanced analytics.
* Full ATS integration.
* Complex block editor.
* Internal candidate applications.
* Candidate profiles.
* Resume processing.
* Applicant tracking.
* Enterprise authentication.
* Complex background queues.
* Microservices.
* Kubernetes.
* Multi-region infrastructure.

Future capabilities must not be implemented unless explicitly brought into scope.

---

# 18. Requirement Priority

When requirements compete, prioritize:

1. Security and tenant isolation.
2. Core recruiter workflow.
3. Core candidate workflow.
4. Data correctness and publishing safety.
5. Mobile usability.
6. Accessibility.
7. SEO.
8. Performance.
9. Maintainability.
10. Future extensibility.

The goal is a focused, working, demonstrable MVP rather than a complete ATS platform.
