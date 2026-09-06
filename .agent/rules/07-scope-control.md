---
trigger: always_on
---

# Scope Control Rules

## 1. Purpose

* Keep development focused on the approved MVP.
* Prevent unnecessary features, architecture, dependencies, and refactoring.
* Prefer completing the required product over expanding the product.
* Treat the assignment requirements as the primary scope boundary.

## 2. MVP Boundary

The MVP focuses on:

* Recruiter authentication.
* Company careers-page management.
* Branding customization.
* Page sections.
* Section ordering.
* Draft saving.
* Preview.
* Publishing.
* Public careers pages.
* Job browsing.
* Job title search.
* Location filtering.
* Job-type filtering.
* External application links.
* Responsive, accessible, SEO-friendly public pages.
* Mobile-first experience.
* PWA-compatible architecture.

## 3. Explicitly Out of Scope

Do not implement unless explicitly requested:

* Candidate accounts.
* Candidate profiles.
* Internal applications.
* Resume uploads for candidates.
* Application tracking.
* Recruiter applicant management.
* Full recruiter job CRUD.
* Live ATS synchronization.
* ATS webhooks.
* Custom domains.
* Advanced analytics.
* Candidate tracking/analytics.
* Enterprise SSO.
* Complex workflow automation.
* Full drag-and-drop website builder.
* Arbitrary page/block plugins.
* Multi-region infrastructure.
* Microservices.
* Kubernetes.
* Event sourcing.
* Complex queues.
* Offline-first synchronization.

## 4. Assignment vs Product Scope

When deciding whether functionality belongs in MVP:

1. Check explicit assignment requirements.
2. Check approved project requirements.
3. Check approved product decisions.
4. Check existing documentation.
5. Only then use engineering judgment.

Do not add functionality merely because it is common in similar products.

## 5. No Feature Creep

Do not implement features described as:

* "Nice to have."
* "Could be useful."
* "Maybe later."
* "Better for production."
* "Common in ATS platforms."

unless they are explicitly required.

Record them as future improvements when useful.

## 6. Scope Classification

Every requested change should be classified as one of:

```text id="2h2r6k"
Required MVP
    ↓
Necessary Supporting Work
    ↓
Bug Fix
    ↓
Quality / Accessibility / Security Improvement
    ↓
Future Enhancement
    ↓
Out of Scope
```

Implement the first four categories when relevant.

Do not implement future enhancements or out-of-scope functionality without approval.

## 7. Necessary Supporting Work

Supporting work is allowed when it is required for the requested feature.

Examples:

* Adding a required database field.
* Adding validation required for a feature.
* Adding a missing server-side authorization check.
* Creating a required reusable component.
* Adding required cache invalidation.
* Fixing a directly affected accessibility issue.

Supporting work must remain proportional to the feature.

## 8. Avoid Unrelated Refactoring

Do not use a feature request as an excuse to:

* Rewrite existing modules.
* Rename unrelated files.
* Change the entire folder structure.
* Replace working libraries.
* Introduce a new architecture.
* Rebuild unrelated components.

If unrelated technical debt is discovered, record it instead of automatically fixing it.

## 9. Scope Expansion Detection

If implementing a feature reveals additional work:

1. Determine whether it is required for correctness.
2. Determine whether it is required for security.
3. Determine whether it is required for the requested user flow.
4. Determine whether it is merely an improvement.

Only the first three should normally expand the current task.

## 10. Architecture Scope

Do not introduce architectural complexity merely because the product may eventually scale.

Do not add:

* Microservices.
* Message brokers.
* Event buses.
* Kubernetes.
* Complex background workers.
* Event sourcing.
* Multi-region deployment.

unless a concrete MVP requirement requires them.

## 11. Dependency Scope

Before adding a dependency:

* Confirm the feature genuinely requires it.
* Check whether the existing stack can solve the problem.
* Avoid adding multiple libraries for the same purpose.
* Prefer the smallest reasonable dependency.

Do not add dependencies solely for convenience when a simple existing solution is sufficient.

## 12. UI Scope

* Use the UI/components/design direction provided by the user.
* Before significant UI implementation without the required UI direction, ask the user once for the relevant component/UI input.
* Do not invent a major design system.
* Do not redesign unrelated screens.
* Do not add animations or visual features merely for polish.
* Keep UI work mobile-first.
* Ensure necessary accessibility improvements are included.

## 13. PWA Scope

PWA capability is part of the product direction.

For MVP:

* Keep the architecture PWA-compatible.
* Implement only explicitly required PWA functionality.
* Do not build complex offline synchronization.
* Do not introduce unnecessary service-worker complexity.
* Do not allow PWA work to delay core product functionality.

## 14. Performance Scope

Performance improvements are in scope when they directly affect required user experience.

Prioritize:

* Public page performance.
* Mobile performance.
* Image optimization.
* Efficient database queries.
* Appropriate caching.
* Small client bundles.

Do not spend significant implementation time on theoretical optimizations without evidence of a problem.

## 15. Security Scope

Security is never treated as optional scope.

Required security work includes:

* Authentication.
* Authorization.
* Tenant isolation.
* Input validation.
* XSS prevention.
* SQL injection prevention.
* Secure media handling.
* Open redirect prevention.
* SSRF protection where relevant.
* Protection of secrets.

Do not defer a security requirement merely because it is inconvenient.

## 16. Accessibility Scope

Accessibility is part of MVP scope.

Do not defer core accessibility requirements as "future polish."

Required considerations include:

* Keyboard navigation.
* Focus states.
* Semantic HTML.
* Accessible forms.
* Screen-reader compatibility.
* Color/contrast.
* Mobile/touch usability.

## 17. Bug vs Feature

Treat an existing incorrect behavior as a bug when it violates:

* Documented requirements.
* Existing approved behavior.
* Security requirements.
* Accessibility requirements.
* Data integrity.
* Core user-flow expectations.

Do not classify a new desired capability as a bug merely because the product does not currently support it.

## 18. "While We're Here" Rule

Do not make unrelated improvements simply because the relevant file is already open.

Examples:

* Do not redesign unrelated UI.
* Do not refactor unrelated services.
* Do not rename unrelated variables.
* Do not upgrade unrelated dependencies.
* Do not restructure unrelated database tables.

Keep the change focused.

## 19. Future Work

When identifying useful out-of-scope work, record it as:

```text id="g15x5m"
Future Enhancement
- Description
- Reason it may be valuable
- Why it is not required for MVP
```

Do not implement it unless explicitly approved.

## 20. Time Constraint

The project is intended to be completed within a focused MVP development window.

When choosing between two valid approaches:

* Prefer the simpler implementation.
* Prefer the approach already supported by the architecture.
* Prefer functionality that can be manually verified quickly.
* Avoid complexity that does not materially improve the assessment result.

Do not sacrifice security, correctness, or core UX merely to save time.

## 21. Change Requests

When the user explicitly requests a new feature:

1. Determine whether it is within MVP scope.
2. Identify affected modules.
3. Identify necessary supporting changes.
4. Implement only the required scope.
5. Identify anything that remains intentionally out of scope.

Do not silently expand the request.

## 22. Scope Conflict

If a requested feature conflicts with an approved product or architectural decision:

* Identify the conflict.
* Explain the impact briefly.
* Do not silently override the approved decision.
* Ask for a decision when the conflict materially affects architecture, security, data, or scope.

## 23. Completion Rule

A task is complete when the requested behavior works and the necessary supporting work is finished.

Do not keep expanding the task after completion with unrelated improvements.

## 24. Golden Rule

**Build the smallest complete solution that satisfies the MVP requirements.**

Do not confuse a better future product with a better MVP.
