---
trigger: always_on
---

# Database Rules

## 1. Database

* Use **PostgreSQL** as the primary database.
* Database access must remain server-side.
* Do not connect to PostgreSQL directly from browser/client code.
* Use the project's approved ORM/query builder/database library.
* Follow the documented schema and relationships.
* Do not introduce a second database for MVP without explicit approval.

## 2. Multi-Tenant Data

* The **company** is the primary tenant.
* Every tenant-owned record must have a clear ownership relationship to its company.
* Tenant isolation is mandatory.
* Every recruiter-side query must be scoped to the authorized company.
* Never trust a client-provided `companyId` for authorization.
* Never fetch records across tenants and filter them afterward when the database query can enforce tenant scope.

Preferred flow:

```text
Authenticated User
    ↓
Authorized Company
    ↓
Tenant-Scoped Query
    ↓
PostgreSQL
```

## 3. Data Ownership

Before creating a new table/entity, determine:

* Who owns the record?
* Is it tenant-specific?
* What company relationship does it have?
* Who can read it?
* Who can modify it?
* Can it ever be publicly exposed?

Do not create tenant-owned data without an explicit ownership path.

## 4. Schema Design

* Use normalized relational structures where appropriate.
* Use primary keys for every persistent entity.
* Use foreign keys for relationships.
* Use appropriate `NOT NULL` constraints.
* Use database constraints for important invariants where practical.
* Use unique constraints for values that must be unique.
* Use appropriate data types instead of storing everything as strings.
* Avoid storing relational data as arbitrary JSON when a relational structure is more appropriate.

JSON/JSONB may be used when the data is intentionally flexible, such as controlled page configuration, but it must still have application-level validation and clear ownership.

## 5. IDs

* Use the project's approved ID strategy consistently.
* Do not expose internal sequential database IDs publicly when the architecture provides safer public identifiers.
* Do not change ID strategy for individual tables without a concrete reason.
* Foreign-key references must use compatible types.

## 6. Timestamps

Persistent entities that require lifecycle tracking should include appropriate timestamps such as:

* `created_at`
* `updated_at`

Use consistent timestamp conventions throughout the database.

Do not store timestamps as arbitrary formatted strings.

## 7. Migrations

* Every schema change must use a migration.
* Do not rely on manual production database changes.
* Migrations must be deterministic and reviewable.
* Do not modify an already-applied migration to represent a new schema change.
* Create a new migration for subsequent changes.
* Review migration impact before applying it.

## 8. Destructive Changes

Treat destructive database operations as high-risk.

Before:

* Dropping a column.
* Dropping a table.
* Changing a column type.
* Removing a constraint.
* Deleting large amounts of data.

verify:

* Existing data impact.
* Application dependencies.
* Migration order.
* Rollback/recovery implications.

Do not perform destructive changes merely to simplify implementation.

## 9. Relationships

Use explicit relational relationships for core entities.

Important relationships include:

```text
Company
 ├── Members
 ├── Careers Page
 │     ├── Draft
 │     ├── Sections
 │     └── Published Revision
 ├── Jobs
 └── Media
```

Foreign keys should enforce valid relationships where appropriate.

Do not duplicate relationship state unnecessarily.

## 10. Careers Page Data

The careers page must support a clear distinction between:

* Current draft state.
* Published state.

The database model must make it difficult for public queries to accidentally retrieve draft content.

Do not rely only on application conventions to distinguish public and draft data when the schema can provide stronger guarantees.

## 11. Page Sections

Supported MVP section types are:

```text
about
life_at_company
custom_text
jobs
```

* Store section ordering explicitly.
* Store the section type explicitly.
* Validate section types against the approved set.
* Enforce the maximum section count at the appropriate application/domain boundary.
* Do not allow arbitrary executable content.
* Do not use database structure to create a generic page-builder system unnecessarily.

## 12. Publishing

Publishing is a business-critical database operation.

Publishing must preserve atomicity.

A publish operation should ensure that:

* The draft is valid.
* The intended revision becomes published.
* The previous published revision is handled correctly.
* No partially published state is exposed.
* Related publication metadata is updated consistently.

Use a database transaction when multiple writes must succeed together.

## 13. Jobs

MVP jobs are seeded/admin-managed data.

Jobs should contain the fields required by the public careers experience, including relevant:

* Title.
* Location.
* Job type.
* Description/details.
* External application URL.
* Active/published state where required.

Do not introduce recruiter job CRUD into the database model unless explicitly required.

Do not design the MVP schema around live ATS synchronization.

## 14. External Application URLs

Application URLs are external destinations.

* Store validated URLs using an appropriate string/text type.
* Validate URLs at the application/service layer.
* Do not assume database storage means a URL is safe.
* Do not allow arbitrary executable content through URL fields.

## 15. Media Records

Media metadata should be associated with the appropriate tenant/domain entity.

The database should store metadata/references rather than unnecessarily storing large binary files.

Typical metadata may include:

* Storage key/reference.
* Media type.
* Original filename where needed.
* Size where needed.
* Created timestamp.
* Ownership information.

Do not store large images or videos directly in PostgreSQL for the MVP.

## 16. Indexing

Create indexes based on actual access patterns.

Important candidates include:

* Tenant/company foreign keys.
* Public company slug lookup.
* Published revision lookup.
* Job filtering fields.
* Frequently queried relationships.

Do not add indexes indiscriminately.

For every additional index, consider:

* Read benefit.
* Write overhead.
* Storage cost.
* Query pattern.

## 17. Uniqueness

Enforce important uniqueness at the database level where practical.

Examples:

* Company slug.
* Membership relationships.
* Other identifiers explicitly required to be unique.

Do not rely exclusively on a preceding application query such as:

```text
check exists → insert
```

when a database unique constraint can prevent race conditions.

## 18. Concurrency

Assume concurrent requests can occur.

Database operations must not depend on:

```text
read → assume unchanged → write
```

when concurrent updates could create incorrect state.

Use appropriate:

* Transactions.
* Constraints.
* Atomic updates.
* Locking strategies where genuinely required.

Do not add complex concurrency mechanisms without a demonstrated need.

## 19. Soft Deactivation and Retention

Deactivated company data follows the approved retention policy.

* Deactivated company data is retained for **90 days**.
* Data becomes eligible for deletion after the retention period.
* Do not immediately hard-delete records that are subject to the retention policy.
* Deletion must respect foreign-key relationships and retention requirements.

## 20. Query Rules

* Select only the fields required by the operation.
* Avoid unnecessary `SELECT *` usage in application queries.
* Avoid N+1 queries.
* Use pagination for potentially large result sets.
* Use deterministic ordering when returning lists.
* Keep filtering and sorting in the database where appropriate.
* Do not retrieve large datasets merely to filter them in application code.

## 21. Transactions

Use transactions when operations contain multiple related writes that must be atomic.

Examples:

* Publishing a revision.
* Creating related records that must exist together.
* Updating publication state and associated records together.

Do not wrap every database operation in a transaction unnecessarily.

## 22. Null and Default Values

* Use `NOT NULL` when a field is required by the domain.
* Use nullable fields only when absence has a meaningful business meaning.
* Use database defaults for stable database-level defaults where appropriate.
* Do not use arbitrary default values to hide missing application data.

## 23. Data Validation

Database constraints are one layer of validation.

Validation should exist at appropriate layers:

```text
Client Validation
      ↓
Server Validation
      ↓
Domain Validation
      ↓
Database Constraints
```

Never assume database constraints alone provide complete application validation.

## 24. Data Exposure

The database model must not determine public exposure by itself.

A record existing in PostgreSQL does not mean it is publicly accessible.

Public access must go through an explicit public-safe data/query boundary.

Never expose:

* Internal authentication data.
* Private company data.
* Draft content.
* Internal permissions.
* Storage credentials.
* Sensitive operational metadata.

## 25. Database Security

* Never interpolate untrusted input directly into SQL.
* Use parameterized queries or the approved ORM/query builder.
* Do not log database credentials.
* Do not expose raw database errors to clients.
* Use least-privilege database credentials where supported.
* Keep database credentials server-side.

## 26. Seed Data

The MVP may use seed/sample data for:

* Companies.
* Recruiter users/memberships.
* Careers page content.
* Jobs.

Seed data should be deterministic and representative of the real product.

Do not make production functionality depend on development-only seed behavior.

## 27. Database Changes and Application Changes

When a feature requires both schema and application changes:

1. Define the schema change.
2. Create the migration.
3. Update data-access logic.
4. Update domain/service logic.
5. Update affected APIs/server actions.
6. Update affected UI.
7. Verify existing data compatibility.
8. Perform manual verification.

Do not change the database schema without considering all consumers.

## 28. Performance

Database design should support the approved performance goals.

Prioritize:

* Appropriate indexes.
* Efficient queries.
* Small result sets.
* Avoiding N+1 queries.
* Appropriate pagination.
* Efficient tenant-scoped lookups.
* Cache-friendly public reads.

Do not prematurely optimize queries that are not performance bottlenecks.

## 29. Schema Change Rule

Before implementing a schema change, answer:

* Why is the change required?
* Which entity owns the data?
* Is tenant isolation preserved?
* Does it affect draft/published behavior?
* What existing data is affected?
* Which queries need updating?
* Which indexes/constraints are required?
* Can the change be safely migrated?

## 30. Golden Rule

**The database must enforce important data integrity while the application enforces business behavior.**

Every database decision must preserve:

* Tenant isolation.
* Data integrity.
* Draft/published separation.
* Security.
* Maintainability.
* Future scalability without unnecessary complexity.
