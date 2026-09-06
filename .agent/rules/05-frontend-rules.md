---
trigger: always_on
---

# Frontend Rules

## 1. Core Principle

* Build the frontend **mobile-first**.
* Prioritize usability, clarity, accessibility, performance, and consistency.
* Follow the project's approved UI direction and provided components.
* Do not invent major UI patterns when the required UI specification has not been provided.
* Keep business logic out of presentation components.

## 2. UI Ownership

* The user may provide components, UI specifications, screenshots, designs, or other visual references.
* Before implementing a significant UI/component task without the required UI direction, **ask the user once for the relevant component or UI input**.
* Do not repeatedly ask for the same information once it has been provided.
* Use provided components and designs as the primary UI source.
* Do not replace provided components with alternatives without a clear technical reason.
* Do not introduce a new component library without approval.
* Do not create a new design system when an existing one is provided.

## 3. Mobile-First

Design and implement in this order:

```text
Mobile
   ↓
Tablet
   ↓
Desktop
```

* Mobile must be a first-class experience, not a reduced desktop layout.
* Prioritize touch-friendly controls.
* Ensure content remains readable on small screens.
* Avoid horizontal scrolling unless explicitly required.
* Do not assume hover interactions are available.
* Responsive behavior must not change business rules.

## 4. Responsive Layout

* Use responsive layouts rather than fixed desktop dimensions.
* Prefer flexible containers, grids, and layouts.
* Define breakpoints based on actual layout needs rather than device names alone.
* Test important flows at mobile, tablet, and desktop widths.
* Prevent text, buttons, forms, images, and navigation from overflowing.
* Ensure dialogs, drawers, menus, and forms remain usable on small screens.

## 5. PWA Compatibility

* Keep the frontend compatible with the application's PWA direction.
* Do not make unnecessary architectural decisions that prevent installability or service-worker integration.
* Do not introduce complex offline functionality unless explicitly required.
* Do not compromise normal browser behavior, accessibility, SEO, or security for PWA behavior.

## 6. Component Architecture

* Use reusable components when reuse is meaningful.
* Keep components focused on one clear responsibility.
* Prefer composition over deeply nested conditional components.
* Avoid giant components containing unrelated functionality.
* Keep domain/business logic outside reusable UI components.
* Avoid creating abstractions for one-off UI without a clear benefit.
* Keep component APIs simple and predictable.

## 7. State Management

* Keep state as local as possible.
* Do not introduce global state when local/server state is sufficient.
* Do not duplicate server state unnecessarily in client state.
* Use the existing project state-management approach consistently.
* Clearly distinguish:

  * Server state.
  * UI state.
  * Form state.
  * Persistent application state.

## 8. Server and Client Components

* Prefer server components when client interactivity is not required.
* Use client components only when browser-side interaction or state requires them.
* Do not mark entire pages as client components unnecessarily.
* Keep sensitive data and server-only logic on the server.
* Do not pass secrets or private server data into client components.

## 9. Data Fetching

* Fetch data at the appropriate server/client boundary.
* Avoid unnecessary client-side requests.
* Do not fetch data in multiple components when a shared server-side fetch is more appropriate.
* Avoid sequential requests when independent requests can be performed efficiently.
* Do not expose internal database models directly to the UI.
* Prefer purpose-specific, safe data shapes for frontend consumption.

## 10. Forms

* Every form must have clear labels.
* Required fields must be clearly indicated.
* Validate user input appropriately.
* Server-side validation remains authoritative.
* Display useful validation errors near the relevant field.
* Preserve entered values when submission fails where practical.
* Prevent accidental duplicate submissions.
* Provide clear loading and success states.
* Ensure forms work with keyboard navigation.

## 11. Loading States

Every asynchronous user-facing operation should have an appropriate loading state.

Examples:

* Saving a draft.
* Publishing.
* Uploading media.
* Loading jobs.
* Applying filters.

Loading states must:

* Communicate that work is in progress.
* Prevent conflicting actions where necessary.
* Avoid unnecessary layout shifts.
* Not trap the user indefinitely without feedback.

## 12. Error States

* Handle expected errors explicitly.
* Show actionable, user-friendly messages.
* Do not expose stack traces or internal errors.
* Keep unaffected UI functional when possible.
* Provide retry options when appropriate.
* Do not silently fail.

## 13. Success Feedback

After important mutations, clearly communicate the result.

Examples:

* Draft saved.
* Page published.
* Media uploaded.
* Changes failed.

Feedback should be noticeable without being disruptive.

## 14. Accessibility

Target **WCAG 2.2 AA**.

* Use semantic HTML.
* Use proper heading hierarchy.
* Associate labels with controls.
* Provide keyboard navigation.
* Provide visible focus states.
* Ensure interactive elements have accessible names.
* Maintain sufficient color contrast.
* Do not use color as the only information channel.
* Provide meaningful error messages.
* Support screen-reader interaction for core workflows.

## 15. Keyboard Interaction

* All important actions must be keyboard accessible.
* Do not create mouse-only interactions.
* Maintain logical tab order.
* Do not trap focus unintentionally.
* Dialogs and menus must handle focus correctly.
* Enter/Space behavior should be appropriate for interactive controls.
* Prefer native HTML controls where they provide the required behavior.

## 16. Touch Interaction

Because the product is mobile-first:

* Controls must be comfortable to tap.
* Avoid tiny interactive targets.
* Avoid interactions that depend on precise pointer movement.
* Provide sufficient spacing between important actions.
* Do not rely on hover to reveal essential functionality.

## 17. Navigation

* Navigation should be predictable.
* Users should understand where they are.
* Mobile navigation must remain easy to access.
* Do not hide critical recruiter actions behind unnecessarily complex navigation.
* Public careers navigation should prioritize company content and job discovery.

## 18. Recruiter Builder UI

The builder should make the following actions clear:

* Edit.
* Add section.
* Remove section.
* Reorder.
* Save draft.
* Preview.
* Publish.

Publishing must be visually distinguishable from saving.

Do not make destructive or irreversible actions ambiguous.

## 19. Public Careers UI

The public experience should prioritize:

1. Company identity.
2. Company content.
3. Available jobs.
4. Job search/filtering.
5. Job details.
6. External application action.

The public page must work without authentication.

## 20. Empty States

Handle empty states intentionally.

Examples:

* No jobs available.
* No jobs match filters.
* Optional company content is unavailable.
* No draft sections exist.

Empty states should explain the situation rather than displaying broken or blank UI.

## 21. Job Filtering

Job filtering/search must:

* Work on mobile.
* Be understandable without instructions.
* Clearly indicate active filters.
* Allow filters to be cleared.
* Handle zero results.
* Avoid unnecessary full-page reloads where client interaction is appropriate.

Filtering must not expose unpublished/inactive data.

## 22. Images and Media

* Use optimized images.
* Provide meaningful alternative text where appropriate.
* Decorative images should not create unnecessary screen-reader noise.
* Avoid loading large media before it is needed.
* Lazy-load non-critical media.
* Preserve appropriate aspect ratios.
* Do not expose private media URLs.

## 23. Typography and Content

* Use readable typography.
* Maintain adequate line height.
* Avoid excessively long text lines.
* Do not rely on placeholder text as the only field label.
* Ensure user-generated content cannot break the layout.
* Handle long company names, job titles, and URLs gracefully.

## 24. SEO

Public careers pages must remain SEO-friendly.

* Essential content must be available in crawlable HTML.
* Use appropriate page metadata.
* Maintain semantic headings.
* Do not hide essential job content behind client-only rendering.
* Preserve canonical public URLs.
* Do not allow UI implementation choices to unnecessarily reduce search visibility.

## 25. Performance

Prioritize:

* Small client bundles.
* Server rendering where appropriate.
* Efficient data fetching.
* Optimized images.
* Lazy loading.
* Minimal unnecessary JavaScript.
* Avoiding unnecessary re-renders.
* Avoiding unnecessary network requests.

Do not optimize prematurely at the cost of readability.

## 26. Security

Frontend security must not be treated as the authorization boundary.

* Never trust client-side permissions.
* Never expose secrets.
* Never place sensitive credentials in browser code.
* Treat all client input as untrusted.
* Do not render unsanitized HTML.
* Do not construct unsafe URLs from untrusted input.
* Do not rely on hidden UI elements to protect functionality.

## 27. UI Consistency

* Follow existing spacing, typography, interaction, and component patterns.
* Reuse provided components consistently.
* Avoid one-off visual patterns when an existing component can be used.
* Keep similar actions visually and behaviorally consistent.
* Do not introduce unnecessary visual complexity.

## 28. Frontend Verification

For affected UI, manually verify:

* Mobile layout.
* Tablet layout where relevant.
* Desktop layout.
* Keyboard navigation.
* Focus behavior.
* Form validation.
* Loading states.
* Error states.
* Empty states.
* Success feedback.
* Long content.
* Small screens.
* Touch interaction.

Do not consider a UI feature complete based only on compilation.

## 29. Frontend Change Rule

Before implementing significant UI changes:

1. Check whether the user has provided the required UI/component direction.
2. Inspect existing components.
3. Identify reusable patterns.
4. Check responsive implications.
5. Check accessibility implications.
6. Check loading/error/empty states.
7. Implement the smallest appropriate change.

## 30. Golden Rule

**Build mobile-first, use the provided UI direction, keep components simple, keep business logic on the server, and make every important interaction accessible and usable.**
