# Project Overview

## 1. Product

**Whitecarrot Careers Page Builder** is a multi-tenant web application that allows companies using an ATS to create, customize, preview, and publish branded Careers pages.

Candidates can visit a company's public Careers page, learn about the company, browse open jobs, search and filter roles, and continue to an external application destination.

The application does **not** implement the job application process itself.

---

## 2. Problem

ATS customers need Careers pages that:

* Represent their brand and culture.
* Present open roles clearly.
* Work well on mobile devices.
* Can be managed by recruiters without developer involvement.
* Are accessible.
* Are SEO-friendly.
* Can be launched and maintained quickly.

Building separate Careers websites for each company creates unnecessary development and maintenance work.

This product provides a centralized Careers Page Builder within the ATS ecosystem.

---

## 3. Product Objective

The MVP should allow a recruiter to:

```text
Login
  ↓
Configure Careers Page
  ↓
Save Draft
  ↓
Preview
  ↓
Publish
  ↓
Share Public URL
```

The candidate experience should be:

```text
Open Careers Page
  ↓
Learn About Company
  ↓
Browse Jobs
  ↓
Search / Filter
  ↓
View Job
  ↓
Apply Externally
```

The product should feel like a practical, cohesive product that could be demonstrated to a real customer.

---

## 4. Target Users

### Recruiter

A recruiter is an authenticated user associated with a company.

The recruiter needs to:

* Configure company branding.
* Configure Careers page content.
* Add sections.
* Remove sections.
* Reorder sections.
* Preview changes.
* Save drafts.
* Publish the page.
* Access/share the public Careers URL.

The recruiter is not necessarily technical.

The builder should allow the recruiter to manage the page without developer assistance.

### Candidate

A candidate is an unauthenticated public visitor.

Candidates need to:

* Understand the company.
* Learn about its culture.
* Browse open roles.
* Search jobs by title.
* Filter jobs by location.
* Filter jobs by job type.
* Open an external application destination.

Candidates do not need an account.

### Platform Administrator

The platform administrator represents the ATS platform rather than an individual company.

For MVP, the administrator may:

* Create/manage companies.
* Manage company slugs.
* Deactivate companies.
* Manage/seed job data.

The platform administrator role exists primarily to support the multi-tenant platform and MVP data model.

---

## 5. Multi-Tenant Model

The application supports multiple companies from the same system.

The **company is the tenant**.

Each company has its own:

* Careers page.
* Branding.
* Content.
* Draft state.
* Published revision.
* Jobs.
* Media references.

Company data must remain isolated.

A recruiter belonging to Company A must never be able to access or modify Company B's protected data.

Tenant isolation is a fundamental product and security requirement.

---

## 6. Recruiter Experience

The recruiter-facing application provides a Careers Page Builder.

Core capabilities:

### Branding

Recruiter can configure:

* Primary color.
* Secondary color.
* Logo.
* Banner/hero image.
* Hero headline.
* Hero subtext.
* Optional CTA.
* Culture video.

### Content

Recruiter can manage fixed section types:

```text
about
life_at_company
custom_text
jobs
```

Recruiter can:

* Add sections.
* Remove sections.
* Reorder sections.
* Edit section content.

The builder is intentionally limited and is **not a general-purpose website builder**.

### Draft

Recruiter changes are saved as draft state.

Draft content is not publicly visible.

### Preview

Recruiter can preview the current draft before publishing.

Preview must not publish the page.

### Publish

Publishing is explicit.

The recruiter must intentionally publish a valid draft.

Only the active published revision is visible to candidates.

---

## 7. Careers Page

The public Careers page uses the company's public slug.

The primary public route is:

```text
/{company-slug}/careers
```

Recruiter routes include:

```text
/{company-slug}/edit
/{company-slug}/preview
```

Authentication is required for recruiter functionality.

The public Careers page does not require authentication.

Unknown, inactive, or unpublished public slugs should return the documented generic 404 behavior.

---

## 8. Public Candidate Experience

The public page presents:

* Company branding.
* Company identity.
* Hero/banner.
* Company content.
* Culture content.
* Available jobs.
* Search and filtering.
* External application actions.

The candidate experience should be:

* Simple.
* Fast.
* Mobile-first.
* Accessible.
* SEO-friendly.
* Easy to scan.

Essential content should be available as crawlable HTML.

---

## 9. Jobs

The MVP uses seeded/admin-managed job data.

Recruiters do not receive full job CRUD functionality in the MVP.

Jobs include relevant information such as:

* Title.
* Description.
* Location(s).
* Job type.
* Department.
* Status.
* External `application_url`.

Only appropriate open/active jobs are shown publicly.

Candidates can:

* Search by job title.
* Filter by location.
* Filter by job type.
* Reset filters.
* Navigate to the external application URL.

No application is submitted through this system.

---

## 10. Application Flow

The MVP stops at the application destination.

```text
Candidate
   ↓
Careers Page
   ↓
Job
   ↓
Apply
   ↓
External application_url
```

The system does not manage:

* Candidate applications.
* Candidate profiles.
* Resumes.
* Application status.
* Screening.
* Interviews.
* Notifications.
* Candidate accounts.

---

## 11. Mobile-First Product Direction

The application is **mobile-first**.

Mobile is the primary design target, not a secondary responsive state.

Development should generally progress:

```text
Mobile
   ↓
Tablet
   ↓
Desktop
```

Important recruiter and candidate workflows must work comfortably on small screens.

The UI should consider:

* Touch-friendly controls.
* Readable typography.
* Responsive layouts.
* Collapsible filters.
* Stacked sections.
* Small-screen forms.
* Mobile navigation.
* Avoiding unnecessary horizontal scrolling.

Desktop layouts should enhance the mobile experience rather than define it.

---

## 12. PWA Direction

The application should be built with **PWA capability in mind**.

The architecture should not unnecessarily prevent future capabilities such as:

* Installability.
* Service workers.
* App-like mobile behavior.
* Appropriate offline-aware experiences.

PWA functionality should remain proportional to MVP scope.

The MVP does not require complex offline synchronization or an offline-first architecture.

PWA behavior must not compromise:

* Accessibility.
* SEO.
* Security.
* Performance.
* Normal browser behavior.

---

## 13. Accessibility

Accessibility is part of the product requirement.

Target:

**WCAG 2.2 AA**

Important experiences should support:

* Keyboard navigation.
* Visible focus.
* Semantic HTML.
* Accessible form labels.
* Screen readers.
* Sufficient contrast.
* Accessible error messages.
* Touch interaction.

Core flows should be manually verified with keyboard navigation and available screen readers such as NVDA or VoiceOver.

---

## 14. SEO

Public Careers pages should be SEO-ready.

They should provide:

* Crawlable HTML.
* Appropriate metadata.
* Canonical URLs.
* Semantic headings.
* Organization structured data.
* JobPosting structured data where applicable.

Essential company and job content should not depend entirely on client-side rendering.

---

## 15. Publishing Model

The system uses an explicit draft/published model.

Conceptually:

```text
Recruiter edits
      ↓
Draft
      ↓
Validate
      ↓
Publish
      ↓
Published Revision
      ↓
Public Careers Page
```

Only one published revision is active at a time.

A recruiter can continue editing a draft without changing the currently published page.

Publishing must not expose partial or invalid data.

Public pages must never read draft data.

---

## 16. Media

The Careers page can use:

* Company logo.
* Banner/hero image.
* Culture video.

Images are stored through approved object storage and delivered efficiently, preferably through a CDN.

Culture videos use approved external providers such as:

* YouTube.
* Vimeo.

Culture videos must not autoplay.

Media must be validated and securely handled.

---

## 17. Architecture Direction

The application uses a **modular monolith**.

High-level structure:

```text
Browser
   ↓
Next.js / React
   ↓
Server/API Layer
   ↓
Domain / Service Layer
   ↓
Data Access Layer
   ↓
PostgreSQL
```

Media:

```text
Application
   ↓
Object Storage
   ↓
CDN
```

Authentication uses a managed authentication solution.

The architecture should remain simple enough for the MVP while allowing future scaling.

---

## 18. Scalability Context

The expected near-term scale is:

* Hundreds of companies.
* One Careers page per company.
* Tens to low hundreds of jobs per company.
* Read-heavy public traffic.
* Relatively low recruiter write traffic.

Potential traffic spikes may occur when companies widely share their Careers pages.

The architecture should therefore favor:

* Efficient tenant-scoped queries.
* Appropriate database indexes.
* Cacheable public content.
* CDN media.
* Stateless application behavior where practical.

Do not introduce microservices or distributed infrastructure prematurely.

---

## 19. MVP Non-Goals

The following are intentionally outside MVP scope:

* Candidate accounts.
* Internal applications.
* Resume processing.
* Candidate profiles.
* Applicant tracking.
* Recruiter job CRUD.
* Live ATS synchronization.
* ATS webhooks.
* Custom domains.
* Advanced analytics.
* Enterprise SSO.
* Advanced approval workflows.
* Full block-based website builder.
* Complex offline synchronization.
* Microservices.
* Kubernetes.
* Event sourcing.
* Complex queues.
* Multi-region infrastructure.

These may be considered in future phases but should not expand the MVP.

---

## 20. Product Priorities

When trade-offs are necessary, prioritize:

1. Functional correctness.
2. Security and tenant isolation.
3. Core recruiter workflow.
4. Core candidate workflow.
5. Mobile-first usability.
6. Accessibility.
7. SEO.
8. Performance.
9. Maintainability.
10. Future extensibility.

Do not sacrifice core functionality for unnecessary polish or infrastructure complexity.

---

## 21. Success Criteria

The MVP should demonstrate that:

* A recruiter can authenticate.
* A recruiter can configure a Careers page.
* Branding can be customized.
* Sections can be managed and reordered.
* Draft changes can be saved.
* A draft can be previewed.
* A draft can be explicitly published.
* Published content is isolated from drafts.
* Company data is tenant-isolated.
* Candidates can access the public Careers page.
* Candidates can search and filter jobs.
* Candidates can reach external application destinations.
* The experience works well on mobile.
* The public page is accessible and SEO-ready.
* The application can be deployed and demonstrated reliably.

## 22. Product Principle

**The product is a focused Careers Page Builder, not a complete ATS.**

The MVP should make it easy for recruiters to create a credible branded Careers page and easy for candidates to discover relevant jobs and continue to the application destination.

The implementation should demonstrate practical engineering judgment through simplicity, security, usability, accessibility, mobile-first design, and clear separation between draft management and public published content.
