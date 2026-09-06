# Database

## 1. Database Overview

The application uses **PostgreSQL** as its primary relational database.

The database supports the multi-tenant Careers Page Builder through:

* Users.
* Companies.
* Company memberships.
* Careers pages.
* Page revisions.
* Page sections.
* Jobs.
* Media assets.
* Audit events.

The **company is the primary tenant**.

All company-owned data must remain tenant-scoped.

---

## 2. Entity Relationship Overview

```text
users
  │
  └── company_memberships ── companies
                              │
                              ├── careers_pages
                              │       │
                              │       ├── page_revisions
                              │       │       └── page_sections
                              │       │
                              │       └── draft / published revision
                              │
                              ├── jobs
                              │
                              ├── media_assets
                              │
                              └── audit_events
```
### Relationship Summary

- A **User** can belong to multiple **Companies** through `company_memberships`.
- A **Company** can have multiple members with different roles.
- Each **Company** owns exactly one **Careers Page**.
- A **Careers Page** contains multiple **Page Revisions**.
- A **Page Revision** contains ordered **Page Sections**.
- A Careers Page maintains pointers to its current draft and published revision.
- A **Company** owns multiple **Jobs**.
- A **Company** owns multiple **Media Assets**.
- **Audit Events** can be associated with both a company and the user who performed the action.
- Page revisions can record the user who created them.
---

## 3. Users

### Table

```text
users
```

### Purpose

Represents an authenticated application user and maps the application user to the external authentication provider.

### Fields

| Field           | Type         | Rules            |
| --------------- | ------------ | ---------------- |
| `id`            | UUID         | Primary key      |
| `clerk_user_id` | VARCHAR(255) | Unique, required |
| `email`         | VARCHAR(255) | Required         |
| `created_at`    | TIMESTAMP TZ | Required         |
| `updated_at`    | TIMESTAMP TZ | Required         |

### Rules

* `clerk_user_id` uniquely identifies the external authentication account.
* Authentication credentials are not stored in PostgreSQL.
* User records may participate in multiple company memberships.

---

## 4. Companies

### Table

```text
companies
```

### Purpose

Represents a company/tenant using the Careers Page Builder.

### Fields

| Field        | Type         | Rules                 |
| ------------ | ------------ | --------------------- |
| `id`         | UUID         | Primary key           |
| `name`       | VARCHAR(255) | Required              |
| `slug`       | VARCHAR(255) | Unique, required      |
| `status`     | ENUM         | `active` / `inactive` |
| `created_at` | TIMESTAMP TZ | Required              |
| `updated_at` | TIMESTAMP TZ | Required              |
| `deleted_at` | TIMESTAMP TZ | Nullable              |

### Rules

* A company is the primary tenant.
* `slug` must be globally unique.
* `status` controls company availability.
* Deactivation must be distinguishable from deletion.
* Company-owned records must be associated with the correct company.

The slug is used to resolve the public Careers page.

Conceptually:

```text
/{company-slug}/careers
```

---

## 5. Company Memberships

### Table

```text
company_memberships
```

### Purpose

Associates users with companies and defines their role within that company.

### Fields

| Field        | Type         | Rules                        |
| ------------ | ------------ | ---------------------------- |
| `company_id` | UUID         | FK → `companies.id`          |
| `user_id`    | UUID         | FK → `users.id`              |
| `role`       | ENUM         | `owner` / `admin` / `editor` |
| `created_at` | TIMESTAMP TZ | Required                     |
| `updated_at` | TIMESTAMP TZ | Required                     |

### Primary Key

```text
(company_id, user_id)
```

### Rules

* A user may belong to multiple companies.
* A membership belongs to exactly one company and one user.
* Authorization must resolve the user's membership before allowing company operations.
* Client-provided company identifiers must never be treated as proof of membership.

---

## 6. Careers Pages

### Table

```text
careers_pages
```

### Purpose

Represents the Careers Page configuration belonging to a company.

### Fields

| Field                       | Type | Rules                      |
| --------------------------- | ---- | -------------------------- |
| `id`                        | UUID | Primary key                |
| `company_id`                | UUID | Unique FK → `companies.id` |
| `current_draft_revision_id` | UUID | Nullable                   |
| `published_revision_id`     | UUID | Nullable                   |

### Rules

* Each company has one Careers Page.
* `company_id` is unique.
* A Careers Page may have a current draft revision.
* A Careers Page may have a published revision.
* The published revision is the source for public rendering.
* Draft and published state must remain separate.

The relationship between `careers_pages` and `page_revisions` is intentionally bidirectional:

```text
careers_pages
    ↓
current_draft_revision_id
published_revision_id
    ↓
page_revisions
    ↓
careers_page_id
```

Migration ordering must account for this relationship.

---

## 7. Page Revisions

### Table

```text
page_revisions
```

### Purpose

Stores versioned snapshots of a Careers Page.

### Fields

| Field             | Type         | Rules                              |
| ----------------- | ------------ | ---------------------------------- |
| `id`              | UUID         | Primary key                        |
| `careers_page_id` | UUID         | FK → `careers_pages.id`            |
| `version`         | INTEGER      | Required                           |
| `lock_version`    | INTEGER      | Default `1`                        |
| `status`          | ENUM         | `draft` / `published` / `archived` |
| `theme_config`    | JSONB        | Required, default `{}`             |
| `created_by`      | UUID         | FK → `users.id`, nullable          |
| `created_at`      | TIMESTAMP TZ | Required                           |
| `updated_at`      | TIMESTAMP TZ | Required                           |
| `published_at`    | TIMESTAMP TZ | Nullable                           |

### Constraints

```text
UNIQUE(careers_page_id, version)
UNIQUE(careers_page_id, id)
```

### Index

```text
(careers_page_id, status)
```

### Rules

* `version` identifies the revision sequence for a Careers Page.
* `lock_version` supports optimistic concurrency control.
* `draft` revisions are editable.
* `published` revisions are publicly available.
* `archived` revisions remain historical but are not publicly active.
* `published_at` is populated for published revisions.
* `created_by` identifies the user responsible for creating the revision where available.

---

## 8. Draft and Published Model

The revision lifecycle is:

```text
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

The Careers Page maintains references to:

```text
current_draft_revision_id
published_revision_id
```

### Requirements

* Recruiter editing operates on the draft.
* Draft changes must not automatically become public.
* Public rendering uses the published revision.
* Publishing must update publication state atomically.
* A partially published state must never be exposed.
* Previous published revisions may become `archived`.

---

## 9. Page Sections

### Table

```text
page_sections
```

### Purpose

Stores the ordered content sections belonging to a specific page revision.

### Fields

| Field           | Type         | Rules                    |
| --------------- | ------------ | ------------------------ |
| `id`            | UUID         | Primary key              |
| `revision_id`   | UUID         | FK → `page_revisions.id` |
| `type`          | ENUM         | Supported section type   |
| `title`         | VARCHAR(120) | Required                 |
| `content`       | JSONB        | Required, default `{}`   |
| `display_order` | INTEGER      | Required, >= 0           |
| `created_at`    | TIMESTAMP TZ | Required                 |
| `updated_at`    | TIMESTAMP TZ | Required                 |

### Constraint

```text
UNIQUE(revision_id, display_order)
```

### Index

```text
(revision_id, display_order)
```

### Rules

* Every section belongs to one revision.
* `display_order` determines rendering order.
* Section ordering must remain deterministic.
* Duplicate positions within the same revision are not allowed.
* `content` stores structured section-specific content.
* Content must be validated according to the section type.
* Unsafe HTML/content must not be persisted or rendered without appropriate sanitization.

---

## 10. Section Types

The database supports the following section types:

```text
about
life_at_company
jobs
our_values
where_we_work
perks
custom_text
```

These are the section types defined by the reference schema and must remain consistent across:

* Database.
* Domain logic.
* API/server actions.
* Builder UI.
* Preview.
* Public Careers page.

The database enum must not drift from the application's supported section types.

---

## 11. Theme Configuration

`page_revisions.theme_config` uses JSONB.

It represents revision-specific visual configuration.

Examples of configuration represented by the Careers Page Builder may include:

* Brand colors.
* Theme settings.
* Visual configuration required by the page renderer.

Theme configuration must:

* Follow a defined application schema.
* Be validated server-side.
* Contain only supported configuration.
* Not contain executable content.
* Remain associated with the revision it belongs to.

Do not treat unrestricted JSON as permission to introduce arbitrary page configuration.

---

## 12. Jobs

### Table

```text
jobs
```

### Purpose

Stores jobs associated with a company and displayed through Careers pages.

### Fields

| Field              | Type          | Rules               |
| ------------------ | ------------- | ------------------- |
| `id`               | UUID          | Primary key         |
| `company_id`       | UUID          | FK → `companies.id` |
| `title`            | VARCHAR(255)  | Required            |
| `slug`             | VARCHAR(255)  | Required            |
| `description`      | TEXT          | Required            |
| `work_policy`      | VARCHAR(100)  | Nullable            |
| `locations`        | TEXT[]        | Default `[]`        |
| `department`       | VARCHAR(100)  | Nullable            |
| `employment_type`  | VARCHAR(100)  | Nullable            |
| `experience_level` | VARCHAR(100)  | Nullable            |
| `job_type`         | VARCHAR(100)  | Nullable            |
| `salary_range`     | VARCHAR(255)  | Nullable            |
| `status`           | ENUM          | `open` / `closed`   |
| `application_url`  | VARCHAR(2048) | Required            |
| `date_posted`      | TIMESTAMP TZ  | Required            |
| `valid_through`    | TIMESTAMP TZ  | Nullable            |
| `created_at`       | TIMESTAMP TZ  | Required            |
| `updated_at`       | TIMESTAMP TZ  | Required            |

### Constraint

```text
UNIQUE(company_id, slug)
```

### Index

```text
(company_id, status)
```

### Rules

* Job slugs are unique within a company.
* Jobs are tenant-owned.
* Job queries must always be company-scoped.
* Public Careers pages expose appropriate open jobs.
* Closed jobs must not be presented as active opportunities.
* `application_url` represents the external destination for applying.

---

## 13. Job Search and Filtering

The database supports public job discovery through:

* Title search.
* Location filtering.
* Job type filtering.
* Job status filtering.

Queries must remain company-scoped.

For potentially large job collections:

* Filter in the database.
* Avoid loading all jobs into application memory unnecessarily.
* Use appropriate indexes.
* Use deterministic ordering.

The database should provide the smallest appropriate result set to the application.

---

## 14. Media Assets

### Table

```text
media_assets
```

### Purpose

Stores metadata and provider references for company media.

### Fields

| Field               | Type          | Rules               |
| ------------------- | ------------- | ------------------- |
| `id`                | UUID          | Primary key         |
| `company_id`        | UUID          | FK → `companies.id` |
| `provider`          | VARCHAR(50)   | Required            |
| `provider_asset_id` | VARCHAR(255)  | Required            |
| `public_id`         | VARCHAR(255)  | Required            |
| `resource_type`     | VARCHAR(50)   | Nullable            |
| `mime_type`         | VARCHAR(100)  | Nullable            |
| `secure_url`        | VARCHAR(2048) | Required            |
| `width`             | INTEGER       | Nullable, >= 0      |
| `height`            | INTEGER       | Nullable, >= 0      |
| `bytes`             | BIGINT        | Nullable, >= 0      |
| `created_at`        | TIMESTAMP TZ  | Required            |

### Constraint

```text
UNIQUE(provider, provider_asset_id)
```

### Storage Provider

The reference implementation uses **Cloudinary**.

The database stores media metadata and provider references rather than binary media itself.

Relevant Cloudinary/provider information includes:

* Provider.
* Provider asset ID.
* Public ID.
* Resource type.
* Secure URL.
* Width.
* Height.
* File size.

Large binary assets must not be stored directly in PostgreSQL.

---

## 15. Media Ownership

Every media asset belongs to a company through:

```text
media_assets.company_id → companies.id
```

Media access must respect company authorization.

A media reference from one company must never be usable to gain unauthorized access to another company's protected media.

---

## 16. Audit Events

### Table

```text
audit_events
```

### Purpose

Records important application actions for traceability.

### Fields

| Field         | Type         | Rules                        |
| ------------- | ------------ | ---------------------------- |
| `id`          | UUID         | Primary key                  |
| `company_id`  | UUID         | Nullable FK → `companies.id` |
| `user_id`     | UUID         | Nullable FK → `users.id`     |
| `action`      | VARCHAR(255) | Required                     |
| `entity_type` | VARCHAR(255) | Required                     |
| `entity_id`   | UUID         | Nullable                     |
| `metadata`    | JSONB        | Required, default `{}`       |
| `created_at`  | TIMESTAMP TZ | Required                     |

### Rules

Audit events may represent actions involving:

* Careers pages.
* Revisions.
* Sections.
* Jobs.
* Media.
* Company configuration.
* Other important company operations.

`metadata` must not contain:

* Passwords.
* Authentication tokens.
* Secrets.
* Storage credentials.
* Sensitive information that is unnecessary for audit purposes.

Audit relationships use nullable foreign keys so audit history can remain meaningful if a related company or user is removed.

---

## 17. PostgreSQL Enums

The reference schema defines:

```text
company_status
  active
  inactive

membership_role
  owner
  admin
  editor

revision_status
  draft
  published
  archived

job_status
  open
  closed

section_type
  about
  life_at_company
  jobs
  our_values
  where_we_work
  perks
  custom_text
```

Application code must use these values consistently.

Do not introduce alternate string representations for the same states.

---

## 18. Foreign-Key Relationships

Core relationships are:

```text
company_memberships.company_id
    → companies.id

company_memberships.user_id
    → users.id

careers_pages.company_id
    → companies.id

page_revisions.careers_page_id
    → careers_pages.id

page_revisions.created_by
    → users.id

page_sections.revision_id
    → page_revisions.id

jobs.company_id
    → companies.id

media_assets.company_id
    → companies.id

audit_events.company_id
    → companies.id

audit_events.user_id
    → users.id
```

The Careers Page draft/published revision references must also point to valid `page_revisions`.

Migration ordering must account for the circular relationship between Careers Pages and revisions.

---

## 19. Referential Actions

Use referential actions intentionally.

Company-owned dependent data may use cascading deletion where appropriate.

Audit references should use `SET NULL` where preserving audit history is required.

Do not use cascading deletion without understanding the complete dependency tree.

Before destructive operations, verify:

* Related records.
* Foreign keys.
* Audit requirements.
* Retention requirements.
* Application behavior.

---

## 20. Tenant Isolation

The company is the database tenant boundary.

Tenant-owned entities include:

```text
careers_pages
page_revisions
page_sections
jobs
media_assets
audit_events
```

Sections and revisions inherit company ownership through the Careers Page relationship.

Every protected query must establish the authorized company before retrieving or modifying data.

Preferred flow:

```text
Authenticated User
      ↓
Company Membership
      ↓
Authorized Company
      ↓
Tenant-Scoped Query
      ↓
PostgreSQL
```

Never fetch cross-tenant records merely to filter them in application code.

---

## 21. Database Constraints

Important integrity rules should be enforced at the database level where practical.

Examples:

* Required fields → `NOT NULL`.
* Unique company slug.
* Unique company membership.
* Unique revision version per Careers Page.
* Unique job slug per company.
* Unique media provider asset.
* Unique section display order per revision.
* Foreign-key relationships.
* Valid enum values.
* Non-negative display order.
* Non-negative media dimensions and sizes.

Application-level validation remains necessary for business rules that cannot reasonably be represented as database constraints.

---

## 22. Migrations

All schema changes must be represented through migrations.

Rules:

* Never manually modify production schema as the normal deployment process.
* Do not edit an already-applied migration to represent a new change.
* Create a new migration for subsequent changes.
* Review migration ordering.
* Review existing-data compatibility.
* Review foreign-key dependencies.
* Review indexes and constraints.

After a migration, verify that the resulting schema matches the intended model.

---

## 23. Circular Revision References

The Careers Page and revision model contains two directions of reference:

```text
careers_pages.current_draft_revision_id
careers_pages.published_revision_id
        ↓
page_revisions.id
        ↓
page_revisions.careers_page_id
        ↓
careers_pages.id
```

Migration implementation must create these relationships in a safe order.

Do not permanently remove foreign-key integrity merely to avoid the circular dependency.

---

## 24. Concurrency

`page_revisions.lock_version` supports optimistic concurrency control.

Use it when concurrent recruiter edits could otherwise overwrite changes.

Database operations involving concurrent updates should use appropriate:

* Transactions.
* Atomic updates.
* Constraints.
* Version checks.

Do not assume a single recruiter request is the only request operating on a record.

---

## 25. Publishing Transaction

Publishing is a multi-step database operation and must be treated as atomic.

Conceptually:

```text
Load Draft
    ↓
Validate
    ↓
Create/Update Published State
    ↓
Update Careers Page Published Revision
    ↓
Archive Previous Published State if required
    ↓
Commit
```

If any required step fails, the transaction must not leave an incomplete published state.

Public requests must never observe an intermediate publication state.

---

## 26. Query Rules

Database queries must:

* Be parameterized.
* Be tenant-scoped.
* Select only required fields where practical.
* Avoid unnecessary `SELECT *`.
* Avoid N+1 queries.
* Filter and sort in the database where appropriate.
* Use pagination for potentially large collections.
* Use deterministic ordering.
* Avoid retrieving large datasets unnecessarily.

---

## 27. Indexing Strategy

Indexes should reflect actual access patterns.

Important existing access patterns include:

```text
companies.slug

company_memberships(user_id, company_id)

page_revisions(careers_page_id, status)

page_sections(revision_id, display_order)

jobs(company_id, status)
```

Unique constraints also provide useful indexes for:

```text
companies.slug

company_memberships(company_id, user_id)

page_revisions(careers_page_id, version)

jobs(company_id, slug)

media_assets(provider, provider_asset_id)
```

Add additional indexes only when justified by actual queries or measured performance needs.

---

## 28. Data Lifecycle

Company deactivation and deletion are separate lifecycle states.

The approved retention policy is:

```text
Company deactivated
      ↓
Retain for 90 days
      ↓
Eligible for deletion
```

Deletion must account for:

* Careers pages.
* Revisions.
* Sections.
* Jobs.
* Media records.
* Audit events.
* Foreign-key behavior.

Do not immediately hard-delete data that is subject to the retention policy.

---

## 29. Seed and Initial Data

The database may be populated with representative data for development and demonstration.

Seed data should cover:

* Multiple companies.
* Company memberships.
* Careers pages.
* Draft and published revisions.
* All supported section types where useful.
* Open and closed jobs.
* Different job locations/types.
* Media references.
* Representative audit events.

Seed data must respect all database constraints and tenant boundaries.

---

## 30. Database Security

* Database credentials remain server-side.
* Never expose database connection strings to the browser.
* Use parameterized queries or the approved ORM/query builder.
* Do not interpolate untrusted input into SQL.
* Do not expose raw database errors to clients.
* Use least-privilege credentials where supported.
* Do not store secrets in ordinary application data fields.

---

## 31. Database and Application Responsibilities

The database is responsible for:

* Persistence.
* Relationships.
* Referential integrity.
* Uniqueness.
* Basic constraints.
* Transactional consistency.

The application/domain layer is responsible for:

* Authorization.
* Business rules.
* Complex validation.
* Publishing behavior.
* Public/private data decisions.
* User-facing behavior.

Both layers are required for a correct system.

---

## 32. Schema Change Checklist

Before changing the schema, verify:

* Which entity owns the new data?
* Is tenant ownership explicit?
* Are relationships correct?
* Are foreign keys required?
* Are uniqueness constraints required?
* Are indexes required?
* Does the change affect draft/published behavior?
* Does existing data remain valid?
* Does the migration handle ordering?
* Does deletion behavior remain correct?
* Does application code need updates?
* Does seed data need updates?

---

## 33. Golden Rule

**The database schema defined by the reference implementation is the source of truth for the application's data model.**

Implementation must preserve:

* PostgreSQL as the database.
* Multi-tenant company ownership.
* User/company memberships.
* Careers Pages.
* Revision-based draft/published state.
* All defined section types.
* Job data.
* Media assets.
* Audit events.
* Referential integrity.
* Data integrity.
* Safe concurrency.
* Correct publishing behavior.
* Consistent migrations.

Do not simplify, remove, or reinterpret schema capabilities merely to reduce MVP scope.
