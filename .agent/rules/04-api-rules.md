---
trigger: always_on
---

# API Rules

## 1. Core Principle

* APIs and server actions are part of the server-side security boundary.
* Every operation must validate input and enforce the appropriate authorization.
* Keep API behavior predictable, explicit, and consistent.
* Do not place core business logic directly inside route handlers or server actions.

## 2. API Types

The application may use:

* Next.js Route Handlers.
* Server Actions.
* Internal server-side service calls.

Use the approach that best fits the operation.

Do not introduce a separate API framework unless explicitly required.

## 3. Request Flow

Protected operations should follow:

```text id="3k7y2e"
Request
  ↓
Authentication
  ↓
Authorization
  ↓
Input Validation
  ↓
Domain / Service Logic
  ↓
Data Access
  ↓
Response
```

Public operations should follow:

```text id="y6x7fa"
Request
  ↓
Input Validation
  ↓
Public Data Access
  ↓
Response
```

## 4. Authentication

For protected operations:

* Verify the authenticated session server-side.
* Do not trust authentication state supplied by the client.
* Reject unauthenticated requests.
* Do not expose authentication tokens or session secrets.
* Do not implement duplicate authentication logic in individual UI components.

## 5. Authorization

Authentication does not imply authorization.

Every protected operation must verify:

* User identity.
* Company membership.
* Required role/permission.
* Requested resource ownership.

Never authorize access based only on:

* Client-side state.
* Hidden form fields.
* URL parameters.
* Client-provided role.
* Client-provided `companyId`.

## 6. Tenant Isolation

All tenant-owned API operations must enforce company scope.

Preferred flow:

```text id="6xqz7h"
Authenticated User
      ↓
Authorized Company
      ↓
Tenant-Scoped Service
      ↓
Tenant-Scoped Query
```

Never:

```text id="s2l6d0"
Fetch all companies
      ↓
Filter in client/application code
```

where tenant filtering can be enforced by the database query.

## 7. Input Validation

Validate all external input on the server.

Validate:

* Types.
* Required fields.
* String lengths.
* Allowed values.
* URL formats.
* File metadata.
* Numeric ranges.
* Section limits.
* Business constraints.

Client-side validation may improve UX but must never replace server-side validation.

## 8. Validation Libraries

Use the project's approved validation approach consistently.

Do not create different validation systems for different endpoints without a clear reason.

Validation schemas should be reusable where the same input is accepted by multiple server operations.

## 9. Request Data

Treat all incoming data as untrusted.

This includes:

* JSON bodies.
* Form data.
* Query parameters.
* Route parameters.
* Headers.
* Cookies.
* Uploaded files.
* External URLs.

Never assume that a value is safe because it originated from the application's own UI.

## 10. Response Data

Return only the data required by the caller.

Do not expose:

* Passwords.
* Authentication secrets.
* Internal credentials.
* Private company data.
* Internal permissions unless required.
* Draft data through public APIs.
* Database implementation details.

Prefer purpose-specific response objects instead of returning complete database records.

## 11. Public API Boundary

Public careers-page operations must expose only public-safe published data.

Public endpoints must not reveal:

* Draft content.
* Unpublished revisions.
* Private company information.
* Recruiter information.
* Internal IDs where unnecessary.
* Internal operational metadata.

Unknown, inactive, or unpublished public slugs must follow the documented generic 404 behavior.

## 12. Draft/Published Boundary

Recruiter APIs may access authorized draft data.

Public APIs/pages may access only published data.

Never use a public endpoint that conditionally exposes draft data based on a client-provided flag.

Examples of unsafe patterns:

```text id="7iy6o4"
?preview=true
?draft=true
```

must never be sufficient to bypass authorization.

## 13. Publishing API

Publishing is a protected operation.

The server must:

1. Authenticate the recruiter.
2. Verify company membership/permission.
3. Load the correct draft.
4. Validate the draft.
5. Publish atomically.
6. Trigger required cache invalidation/revalidation.
7. Return a safe result.

The client must never directly control which revision becomes publicly active without server verification.

## 14. CRUD Rules

Only implement API operations required by MVP.

Do not automatically create:

* Full CRUD endpoints for every table.
* Generic CRUD APIs.
* Administrative endpoints.
* Future ATS endpoints.

Use domain-oriented operations where they better represent business behavior.

## 15. HTTP Semantics

When using HTTP APIs:

* Use appropriate HTTP methods.
* Use appropriate status codes.
* Keep responses consistent.
* Do not return `200` for every failure.
* Do not use successful status codes for authorization failures.
* Do not expose internal error details through status messages.

## 16. Error Responses

Errors should be predictable and safe.

Differentiate between:

* Validation errors.
* Authentication failures.
* Authorization failures.
* Not found.
* Conflict/state errors.
* Rate limiting.
* Unexpected server errors.

User-facing errors should be actionable.

Internal implementation details must remain server-side.

## 17. Error Handling

Never expose:

* Stack traces.
* SQL statements.
* Database connection details.
* Secrets.
* Internal service credentials.

Unexpected errors should be logged appropriately and converted into a safe response.

Do not silently swallow errors.

## 18. Idempotency

Operations that may be retried must be designed carefully.

Where duplicate execution could cause harmful results, use appropriate:

* Database constraints.
* Transactions.
* Idempotency mechanisms.
* Atomic operations.

Do not add idempotency infrastructure where duplicate execution has no meaningful consequence.

## 19. Concurrency

Assume multiple requests can happen at the same time.

Do not rely on:

```text id="x6i4st"
check → assume unchanged → update
```

when concurrent requests could create an invalid state.

Use database constraints and transactions where necessary.

## 20. Rate Limiting

Apply rate limiting where abuse could materially affect the system.

Prioritize:

* Authentication endpoints.
* Sensitive mutations.
* Public endpoints vulnerable to abuse.
* Media/upload operations.

Do not introduce unnecessarily complex rate-limiting infrastructure for low-risk internal operations.

## 21. CSRF

For state-changing operations using cookie-based authentication:

* Follow the project's approved CSRF protection strategy.
* Do not assume that same-origin UI automatically makes every mutation safe.
* Verify request origin/CSRF protections where required by the authentication architecture.

Do not implement redundant CSRF mechanisms without understanding the existing authentication model.

## 22. XSS Protection

* Never render untrusted HTML directly.
* Sanitize allowed rich text before rendering.
* Do not trust HTML supplied by the client.
* Avoid unsafe HTML rendering APIs.
* Treat recruiter-provided content as untrusted.

## 23. SQL Injection Protection

* Use parameterized queries or the approved ORM/query builder.
* Never concatenate untrusted input into SQL.
* Do not dynamically construct SQL from unchecked user input.
* Validate sortable/filterable fields against an allowlist when dynamic queries are required.

## 24. SSRF Protection

For server-side requests involving user-provided URLs:

* Validate the URL.
* Allow only approved providers/domains where applicable.
* Do not allow arbitrary internal network access.
* Do not allow requests to internal/private addresses.
* Do not treat URL validation in the browser as sufficient.

This is particularly important for external media/video integrations.

## 25. Open Redirect Protection

Do not redirect users to arbitrary URLs supplied by the client.

External application links must be treated as destinations, not trusted redirect instructions.

Validate and constrain redirect behavior where redirects are implemented.

## 26. Media Upload APIs

Upload operations must:

* Require authorization.
* Enforce tenant ownership.
* Validate file size.
* Validate allowed file types.
* Validate content appropriately.
* Generate safe storage keys.
* Avoid exposing storage credentials.
* Prevent malicious filenames or paths.
* Use the approved object-storage flow.

Do not trust client-provided MIME types or filenames.

## 27. External Video APIs

Culture video URLs must:

* Support only approved providers.
* Be validated server-side.
* Reject arbitrary embed domains.
* Be stored in a normalized/safe representation where appropriate.

Do not fetch arbitrary external URLs from the server.

## 28. API and Database Separation

Route handlers/server actions should not contain large database-query implementations.

Prefer:

```text id="jzq8wy"
API / Server Action
       ↓
Domain / Service
       ↓
Data Access
```

This keeps business logic reusable and testable.

## 29. API and UI Separation

The UI should not need to understand database implementation details.

Avoid returning raw database objects simply because they are convenient.

Define data shapes around the operation's needs.

## 30. Caching

Before caching an API response, determine:

* Is the data public?
* Is it published?
* Is it tenant-specific?
* Can another user receive it?
* Does it become stale after publishing?

Never cache protected draft data in a public/shared cache.

## 31. Performance

APIs should support the approved performance target:

* API p95 latency: **<300 ms**

Prefer:

* Efficient queries.
* Appropriate indexes.
* Small responses.
* Pagination where necessary.
* Avoiding N+1 queries.
* Caching appropriate public data.

Do not optimize prematurely without evidence of a problem.

## 32. Logging

Log enough information to diagnose failures.

Do not log:

* Passwords.
* Tokens.
* Secrets.
* Credentials.
* Sensitive personal information.

Use structured logs where supported by the project.

## 33. API Change Rule

Before adding or changing an API/server action:

1. Identify the caller.
2. Identify whether it is public or protected.
3. Identify the tenant boundary.
4. Identify required permissions.
5. Define input validation.
6. Define safe response data.
7. Identify database operations.
8. Identify caching implications.
9. Identify error states.
10. Verify the affected flow manually.

## 34. No Generic API by Default

Do not create a generic endpoint such as:

```text id="q5k3a8"
/api/{table}/{action}
```

for convenience.

APIs should represent meaningful application operations and enforce the appropriate domain rules.

## 35. Golden Rule

**Every server operation must have an explicit security boundary, validated input, correct tenant scope, clear business ownership, and a safe response.**
