---
trigger: always_on
---

# Core AI Development Rules

## 1. Project Context

* This project is the Careers Page Builder MVP.
* Read the relevant project documentation before implementing any feature.
* Treat the documented requirements and approved decisions as the source of truth.
* Do not rely on assumptions when project documentation defines the behavior.

## 2. Requirement Rules

* Implement exactly what is required.
* Do not invent product requirements.
* Do not silently change existing behavior.
* Do not remove functionality unless explicitly instructed.
* Do not reinterpret ambiguous requirements without first identifying the ambiguity.
* If a requirement conflicts with an approved decision, stop and report the conflict.
* Prefer the existing documented behavior over generic best practices when they conflict.

## 3. Architecture Rules

* Follow the approved modular-monolith architecture.
* Keep domain/module boundaries clear.
* Do not introduce microservices for MVP.
* Do not introduce queues, event buses, event sourcing, Kubernetes, or distributed infrastructure without explicit approval.
* Keep business logic out of UI components.
* Keep database access behind the appropriate server-side/data-access boundary.
* Do not create unnecessary abstractions.
* Reuse existing project patterns when appropriate.

## 4. MVP Scope Rules

* Build only MVP functionality unless explicitly instructed otherwise.
* Do not implement future-phase functionality proactively.
* Do not add features because they "would be useful".
* Do not expand the scope of an existing task.
* Record useful out-of-scope ideas as future improvements instead of implementing them.
* Do not re-debate finalized architectural or product decisions.

## 5. Code Rules

* Use TypeScript with strict typing.
* Avoid `any` unless there is a documented and justified reason.
* Prefer simple, readable code over clever code.
* Use descriptive names.
* Keep functions and components focused.
* Avoid unnecessary duplication.
* Avoid unnecessary global state.
* Avoid magic values where constants or configuration are more appropriate.
* Remove unused code and imports.
* Do not leave debug statements in production code.
* Do not add comments that merely restate the code.
* Comments should explain important reasoning or constraints.

## 6. Server/Client Rules

* Keep sensitive logic on the server.
* Never expose secrets or private credentials to the client.
* Do not move server-side logic to the client merely for convenience.
* Use server rendering for public careers-page content where required.
* Use client-side interactivity only where it is actually needed.
* Do not make the entire application client-rendered unnecessarily.

## 7. Authentication Rules

* Authentication and authorization are separate concerns.
* Never treat an authenticated user as automatically authorized.
* Validate the authenticated session on the server.
* Never trust client-provided roles or permissions.
* Never use client-side checks as the only authorization mechanism.
* Protected operations must perform server-side authorization.

## 8. Tenant Isolation Rules

* Company data must always be tenant-scoped.
* Every recruiter operation must verify company membership.
* Every protected company operation must verify the user's role.
* Never trust a `companyId` supplied by the client.
* Never retrieve all tenants and filter them in application code when tenant filtering can be performed at the data-access layer.
* Never allow a user belonging to one company to access another company's data.
* Review tenant-isolation implications whenever adding a new database query or endpoint.

## 9. Database Rules

* Use the documented PostgreSQL schema as the baseline.
* Schema changes must use migrations.
* Do not modify the database manually when a migration should be used.
* Preserve foreign-key relationships.
* Use database constraints for important invariants where appropriate.
* Use transactions for operations that must succeed or fail atomically.
* Avoid N+1 queries.
* Add indexes based on documented access patterns.
* Never bypass tenant-scoping requirements for convenience.

## 10. Validation Rules

* Validate all externally supplied input on the server.
* Client-side validation must not replace server-side validation.
* Validate types, lengths, formats, ranges, and allowed values.
* Reject invalid data rather than silently correcting it unless the requirements explicitly allow normalization.
* Sanitize user-generated rich text before rendering.
* Validate uploaded media server-side.
* Validate external URLs against their approved allowlist.

## 11. Publishing Rules

* Saving a draft must never automatically publish it.
* Draft data must never be exposed through public careers pages.
* Public careers pages must use the active published revision only.
* Publishing must validate the draft before making it public.
* Publishing must activate the new revision atomically.
* Only one published revision may be active at a time.
* Cache invalidation must occur when publishing requires it.
* Never partially publish a page.

## 12. Public Page Rules

* Public pages must only expose published and active company data.
* Unknown, inactive, or unpublished companies must follow the documented 404 behavior.
* Do not leak whether an unpublished company exists.
* Public pages must remain crawlable.
* Public pages must work correctly on mobile.
* Public pages must handle loading, error, and empty states appropriately.

## 13. Media Rules

* Do not accept arbitrary media types when an allowlist is defined.
* Enforce file-size limits server-side.
* Do not trust MIME types supplied only by the client.
* Do not expose private storage credentials.
* Use the approved object-storage flow.
* Do not allow arbitrary external media URLs when uploads are required.
* Sanitize SVG files or reject them when safe sanitization cannot be guaranteed.

## 14. External URL Rules

* Validate external URLs server-side.
* Only allow providers explicitly approved by the project requirements.
* Prevent open redirects.
* Do not embed arbitrary external domains.
* Do not allow user-controlled URL parameters to bypass provider restrictions.

## 15. API Rules

* Every API/server action must validate its input.
* Protected APIs must authenticate the user.
* Protected APIs must authorize the requested resource.
* APIs must enforce tenant isolation.
* APIs must return predictable errors.
* Do not expose internal database errors directly to users.
* Do not expose sensitive implementation details in responses.
* Keep business rules in server-side domain/service logic rather than UI code.

## 16. Frontend Rules

* Follow the established design system.
* Prefer reusable components for genuinely repeated UI.
* Use semantic HTML.
* Provide accessible labels for controls.
* Provide visible keyboard focus.
* Handle loading, error, success, and empty states.
* Do not use color as the only way to communicate information.
* Do not create inaccessible custom controls when native controls are sufficient.
* Keep recruiter workflows simple and predictable.
* The user may provide components, UI specifications, screenshots, design references, or other UI-related requirements.
* When UI/component input has not yet been provided for a requested UI task, ask the user once for the relevant component or UI specification before implementing the design.
* Do not invent major UI patterns, layouts, components, or visual styles when the user has indicated that they will provide them.
* Once the user provides UI/component requirements, follow them consistently.
* Do not replace user-provided components with alternative implementations without a clear technical reason.
* Reuse provided components where applicable.
* Do not introduce a new component library or design system without approval.
* Small implementation details may be decided using engineering judgment after the required UI direction has provided.

## 17. Accessibility Rules

* Target WCAG 2.2 AA.
* Support keyboard navigation for core flows.
* Maintain visible focus states.
* Maintain sufficient color contrast.
* Use semantic headings in logical order.
* Associate labels with form controls.
* Ensure interactive elements are accessible to screen readers.
* Test affected UI manually with keyboard navigation.
* Consider NVDA and VoiceOver for core flows.

## 18. SEO Rules

* Public careers pages must provide crawlable HTML.
* Use server-rendered content where required.
* Provide appropriate page metadata.
* Generate the approved structured data.
* Do not hide essential job content behind client-only rendering.
* Ensure canonical/public URLs are consistent with the documented routing model.

## 19. Performance Rules

* Optimize public pages before adding unnecessary client-side JavaScript.
* Optimize and appropriately size images.
* Lazy-load non-critical media.
* Avoid unnecessary network requests.
* Avoid N+1 database queries.
* Use appropriate caching for public content.
* Do not sacrifice correctness or accessibility for premature performance optimization.

## 20. Error Handling Rules

* Never silently swallow errors.
* Do not use empty `catch` blocks.
* Distinguish validation errors from unexpected system errors.
* Show useful, non-sensitive error messages to users.
* Log unexpected server-side failures appropriately.
* Preserve user work where possible when an operation fails.
* Provide retry behavior where appropriate.
* Never expose secrets, stack traces, or internal database errors to users.

## 21. Change Rules

Before modifying code:

* Inspect the existing implementation.
* Identify all affected files.
* Identify dependencies and side effects.
* Check whether the change affects other modules.
* Check authorization implications.
* Check database implications.
* Check existing user flows.

After modifying code:

* Review the complete diff.
* Remove unrelated changes.
* Remove temporary/debug code.
* Verify affected flows manually.
* Verify important edge cases.
* Verify that existing functionality was not unintentionally changed.

## 22. Refactoring Rules

* Do not refactor unrelated code during feature implementation.
* Do not rewrite working code without a concrete reason.
* Do not introduce abstractions for hypothetical future requirements.
* Refactor only when it improves correctness, maintainability, or is necessary for the requested feature.
* Keep refactors separate from feature changes when practical.

## 23. Dependency Rules

* Do not add a dependency when the existing stack can solve the problem reasonably.
* Before adding a dependency, determine whether it is necessary.
* Prefer small, well-maintained dependencies.
* Do not introduce multiple libraries that solve the same problem.
* Do not replace an existing project dependency without a concrete reason.
* Record significant dependency decisions.

## 24. Environment and Secret Rules

* Never commit secrets.
* Never hard-code API keys, passwords, tokens, or credentials.
* Use environment variables for secrets and environment-specific configuration.
* Never expose server-only environment variables to client code.
* Do not modify production credentials during development.
* Do not create fake production credentials in source code.

## 25. Verification Rules

* Code compilation alone does not mean the feature is complete.
* Passing automated checks does not replace manual verification.
* Every implemented feature must have a relevant manual verification checklist.
* Verify the happy path.
* Verify validation failures.
* Verify error states.
* Verify authorization boundaries.
* Verify empty states.
* Verify persistence after refresh/navigation.
* Verify responsive behavior where applicable.
* Verify accessibility for affected UI.
* Verify that public and draft data remain correctly separated.

## 26. Golden Rule

Do not optimize for writing more code. Optimize for implementing the correct behavior with the smallest safe, maintainable change.