---
trigger: always_on
---

# Architecture Rules

## 1. Architecture Style

* Use a **modular monolith** architecture for the MVP.
* Keep the application as a single deployable system.
* Organize code around clear business/domain boundaries.
* Do not introduce microservices for MVP.
* Do not introduce distributed infrastructure without an explicit requirement.
* Prefer simple architecture that can evolve as the product grows.

## 2. Approved Technology Direction

Use the approved technology direction:

* Next.js.
* Node.js through the Next.js server environment.
* PostgreSQL.
* Managed authentication.
* S3-compatible object storage.
* CDN for appropriate public media/content.

Do not replace approved technologies without an explicit reason and approval.

## 3. High-Level Architecture

```text
Browser
   │
   ▼
Next.js Application
   │
   ├── Public Careers Experience
   ├── Recruiter Experience
   └── Server/API Layer
            │
            ▼
      Domain / Service Layer
            │
            ▼
       Data Access Layer
            │
            ▼
        PostgreSQL

Media → Object Storage → CDN
```

The exact folder structure may differ, but responsibility boundaries must remain clear.

## 4. Domain Modules

Core domains include:

* Authentication / authorization.
* Companies / tenants.
* Careers page builder.
* Page sections.
* Publishing / revisions.
* Jobs.
* Media.
* Public careers pages.

A module should own the business logic relevant to its domain.

Do not create one global service containing unrelated business logic.

## 5. Layer Responsibilities

### Presentation

Responsible for:

* Rendering UI.
* User interaction.
* Loading/error/success states.
* Collecting input.
* Calling server operations.

Do not place core business rules in UI components.

### Server/API

Responsible for:

* Authentication.
* Authorization.
* Input validation.
* Request handling.
* Calling domain services.
* Returning safe responses.

### Domain/Service

Responsible for:

* Business rules.
* Domain operations.
* Publishing.
* Business validation.
* Coordinating related operations.

### Data Access

Responsible for:

* Database queries.
* Persistence.
* Transactions.
* Tenant-scoped access.
* Database-to-application mapping.

Do not place UI or HTTP concerns in data-access code.

## 6. Dependency Direction

Prefer:

```text
UI
 ↓
Server/API
 ↓
Domain/Services
 ↓
Data Access
 ↓
Database
```

Lower layers must not depend on higher presentation layers.

Database code must not depend on React components or browser APIs.

## 7. Business Logic

* Every business rule must have a clear owner.
* Do not duplicate business rules across UI components.
* Server-side domain logic is authoritative.
* Reuse domain services when multiple entry points perform the same operation.
* Publishing must have one authoritative server-side implementation.

## 8. Security Boundary

The server is the security boundary.

Operations that read or modify protected company data must perform:

1. Authentication.
2. Authorization.
3. Input validation.
4. Tenant scoping.

Never rely on client-side checks for security.

## 9. Tenant-Aware Architecture

Protected company operations should follow:

```text
Authenticated User
       ↓
Membership / Authorization
       ↓
Authorized Company
       ↓
Tenant-Scoped Service
       ↓
Tenant-Scoped Data Access
       ↓
Database
```

Never allow a client-supplied `companyId` to establish authorization.

Where practical, design data-access methods so tenant scope is required.

## 10. Public vs Private Architecture

Keep public careers-page access separate from authenticated recruiter operations.

```text
Public Request
    ↓
Published Data
    ↓
Public Renderer

Recruiter Request
    ↓
Authentication
    ↓
Authorization
    ↓
Draft / Company Data
    ↓
Builder
```

Public rendering must never depend on recruiter authentication.

Recruiter functionality must never expose draft data publicly.

## 11. Published Data Boundary

Public careers pages must consume the **published representation** of the page.

Do not reconstruct publication state from arbitrary draft records.

Prefer an explicit published revision/snapshot model.

The architecture should make accidental draft exposure difficult.

## 12. Draft and Published Revisions

The intended flow is:

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

Publishing must create/activate a coherent published representation.

The public page must remain stable while a recruiter edits a draft.

## 13. Preview

Preview renders the current draft for an authorized recruiter.

* Preview must not publish.
* Preview must remain authorization-protected.
* Preview may access draft data.
* Public pages may access only published data.
* Rendering logic may be shared between preview and public pages where appropriate.

## 14. Rendering Strategy

### Public Careers Pages

Prefer server rendering and cache-friendly rendering for:

* SEO.
* Fast initial rendering.
* Crawlable content.
* Mobile performance.

### Recruiter Builder

Client-side behavior is appropriate for interactive editing.

Do not make the entire application client-rendered unnecessarily.

## 15. Mobile-First Architecture

The application is **mobile-first**.

Design and implementation should progress from:

```text
Mobile → Tablet → Desktop
```

Do not design desktop first and simply shrink it for mobile.

Responsive behavior belongs in the presentation layer.

Do not couple business logic to screen size.

## 16. PWA Direction

Keep the architecture compatible with future PWA capabilities.

Avoid decisions that unnecessarily prevent:

* Installability.
* Service workers.
* App-like mobile behavior.
* Appropriate offline-aware capabilities.

For MVP:

* Do not build complex offline synchronization.
* Do not make the application offline-first unless explicitly required.
* Do not compromise SEO or normal browser functionality for PWA behavior.

## 17. Caching

Public content is read-heavy and should be cacheable where appropriate.

Caching must respect:

* Published state.
* Company/tenant boundaries.
* Public/private boundaries.

Draft data must never enter public caches.

Publishing should trigger required cache invalidation/revalidation.

## 18. Media Architecture

Use:

```text
Client
  ↓
Validated Upload Flow
  ↓
Object Storage
  ↓
CDN
  ↓
Public Page
```

Do not unnecessarily proxy large public media through the application server.

Private storage credentials must never reach the client.

## 19. External Integrations

Isolate provider-specific integrations such as:

* Authentication provider.
* Object storage.
* CDN.
* YouTube.
* Vimeo.

Do not spread provider-specific code throughout the application.

Do not build generic integration abstractions without an actual requirement.

## 20. Database Access

* Database access must remain server-side.
* Never connect directly to PostgreSQL from browser code.
* Keep queries within the appropriate data-access/domain module.
* Use parameterized queries or the approved ORM/query builder.
* Keep tenant filtering explicit.
* Use transactions for atomic multi-write operations.
* Avoid N+1 queries.

## 21. API / Server Actions

Regardless of whether route handlers or server actions are used:

* Validate inputs at the boundary.
* Authenticate protected operations.
* Authorize resources.
* Enforce tenant isolation.
* Call domain/service logic.
* Return safe data.

Server actions and API routes must not become containers for all business logic.

## 22. Error Handling

Handle errors at the appropriate layer:

```text
Infrastructure Error
       ↓
Domain / Service Handling
       ↓
Safe Server Response
       ↓
UI Error State
```

Do not expose raw database, infrastructure, or stack-trace information to users.

## 23. Observability

Allow meaningful server-side logging and error monitoring.

Never log:

* Passwords.
* Authentication tokens.
* Secrets.
* Credentials.
* Sensitive user information.

Logs should help diagnose failures without creating data-leakage risks.

## 24. Performance

Design toward the approved performance goals.

Prioritize:

* Server-rendered public content.
* Efficient queries.
* Appropriate indexes.
* Caching.
* CDN media.
* Small client bundles.
* Lazy loading of non-critical content.
* Minimal unnecessary network requests.

Do not introduce complex infrastructure solely for theoretical scale.

## 25. Scalability

Design the MVP so it can evolve.

Prefer:

* Clear domain boundaries.
* Tenant-scoped queries.
* Stateless application behavior where practical.
* Proper database indexes.
* Cacheable public pages.
* CDN media.
* Isolated external integrations.

Do not implement distributed architecture before actual requirements justify it.

## 26. Avoid Premature Abstraction

Do not build abstractions for hypothetical future requirements.

Avoid unnecessary:

* Generic repository frameworks.
* Generic page-builder engines.
* Event buses.
* Workflow engines.
* Plugin systems.
* Service factories.

Abstract repeated behavior when there is a demonstrated need.

## 27. Architecture Change Rule

Treat changes to the following as architectural changes:

* Database architecture.
* Authentication architecture.
* Tenant isolation.
* Publishing model.
* Rendering strategy.
* Infrastructure.
* External integrations.
* Major module boundaries.

Do not silently introduce these changes during ordinary feature work.

## 28. Feature Implementation Rule

Before implementing a feature, identify:

* Domain owner.
* Data involved.
* Public/private status.
* Authorization boundary.
* Service/domain owner.
* UI consumer.
* Publishing implications.
* Caching implications.

Then implement through the appropriate architectural layers.

## 29. Architecture Priority

When multiple implementations are possible, prefer the one that:

1. Matches requirements.
2. Preserves security.
3. Preserves tenant isolation.
4. Preserves draft/published separation.
5. Supports mobile-first UX.
6. Supports SEO and public rendering.
7. Remains simple.
8. Is maintainable.
9. Can evolve without premature complexity.

## 30. Golden Rule

**Keep the system simple, modular, secure, mobile-first, PWA-compatible, and easy to evolve.**

Strong architecture means clear boundaries and deliberate simplicity—not unnecessary complexity.