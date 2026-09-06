---
trigger: always_on
---

# UX and Accessibility Rules

## 1. Core UX Principle

* Build the product **mobile-first**.
* Prioritize clarity, simplicity, accessibility, and predictable interaction.
* Every important user action must have a clear purpose and visible outcome.
* Do not add unnecessary interaction steps.
* Prefer familiar interaction patterns over novel ones.
* Do not sacrifice usability for visual complexity.

## 2. UI Direction

* Follow UI components, designs, screenshots, and specifications provided by the user.
* Before implementing significant UI work without the required UI direction, ask the user once for the relevant UI/component input.
* Do not invent major layouts or interaction patterns when the user has indicated that UI direction will be provided.
* Reuse provided components consistently.
* Do not replace provided components without a clear technical reason.

## 3. Mobile-First UX

Mobile is the primary UX target.

Design in this order:

```text id="5x3m2v"
Mobile → Tablet → Desktop
```

* Ensure important workflows work comfortably on small screens.
* Prioritize touch interaction.
* Avoid desktop-only interaction patterns.
* Do not depend on hover for essential functionality.
* Avoid horizontal scrolling unless explicitly required.
* Ensure forms, dialogs, menus, and actions remain usable on mobile.

## 4. Touch Interaction

* Interactive controls must have comfortable touch targets.
* Provide adequate spacing between adjacent actions.
* Avoid requiring precise pointer movement.
* Do not hide essential actions behind hover.
* Ensure drag/reorder interactions have an accessible alternative where applicable.
* Do not make touch gestures the only way to perform important actions.

## 5. Information Architecture

* Group related information together.
* Use clear section headings.
* Maintain predictable navigation.
* Keep primary actions easy to discover.
* Avoid deeply nested navigation.
* Make the current location/state understandable.
* Preserve user context when navigating between related views.

## 6. Recruiter Workflow UX

The builder should make these actions obvious:

* Edit.
* Add section.
* Remove section.
* Reorder.
* Save draft.
* Preview.
* Publish.

The difference between **Save**, **Preview**, and **Publish** must be clear.

Do not make publishing look like an ordinary save action.

## 7. Candidate Workflow UX

The public careers experience should make it easy to:

1. Understand the company.
2. Discover available jobs.
3. Search jobs.
4. Filter jobs.
5. Read job information.
6. Apply through the external application link.

Do not require authentication for public careers-page browsing.

## 8. Forms

* Every input must have a visible or programmatically associated label.
* Required fields must be identifiable.
* Validation errors must explain what needs to be corrected.
* Display errors close to the relevant field where practical.
* Preserve valid user input after validation failure.
* Prevent accidental duplicate submissions.
* Show clear loading state during submission.
* Show clear success/failure feedback.
* Ensure forms are keyboard accessible.

## 9. Destructive Actions

For destructive or potentially irreversible actions:

* Make the action clearly identifiable.
* Avoid ambiguous labels.
* Require confirmation when accidental activation could cause meaningful data loss.
* Clearly communicate what will be affected.
* Do not use confirmation dialogs for trivial actions unnecessarily.

## 10. Feedback

Every important asynchronous action should provide appropriate feedback.

Examples:

```text id="i4h5al"
Save → Saving → Saved
Publish → Publishing → Published
Upload → Uploading → Uploaded
Action → Failed → Recovery option
```

Feedback should be:

* Timely.
* Understandable.
* Visible.
* Non-disruptive where possible.

## 11. Loading States

* Show loading indicators for operations that take noticeable time.
* Prevent conflicting actions during critical operations where necessary.
* Avoid unnecessary layout shifts.
* Do not display indefinite loading without explanation.
* Preserve existing content where possible during background updates.

## 12. Error UX

* Explain errors in user-understandable language.
* Tell the user what they can do next when possible.
* Keep technical details out of user-facing messages.
* Do not blame the user.
* Do not silently fail.
* Provide retry/recovery options where appropriate.
* Preserve user-entered information where practical.

## 13. Empty States

Empty states must explain why content is absent.

Examples:

* No jobs available.
* No jobs match the current filters.
* No sections configured.
* Optional company content unavailable.

Avoid blank screens with no explanation.

## 14. Responsive Behavior

The interface must work across:

* Mobile.
* Tablet.
* Desktop.

Verify that:

* Text does not overflow.
* Buttons remain usable.
* Forms remain usable.
* Images scale correctly.
* Dialogs fit the viewport.
* Navigation remains accessible.
* Long titles and content do not break layouts.

## 15. Accessibility Standard

Target **WCAG 2.2 AA**.

Accessibility is a product requirement, not a final-stage enhancement.

All new UI must consider accessibility during implementation.

## 16. Semantic HTML

Prefer native semantic HTML:

* `header`
* `nav`
* `main`
* `section`
* `article`
* `footer`
* `button`
* `form`
* `label`
* `input`
* `select`

Do not use generic elements such as `<div>` as interactive controls when native elements are appropriate.

## 17. Keyboard Accessibility

All important functionality must be keyboard accessible.

Verify:

* Logical tab order.
* Visible focus.
* Keyboard activation.
* Dialog focus.
* Menu focus.
* Form navigation.
* No accidental keyboard traps.

Do not create mouse-only interactions.

## 18. Focus Management

* Focus must remain understandable after navigation or dynamic updates.
* Dialogs must manage focus appropriately.
* Closing a dialog should return focus to a sensible control.
* Dynamically displayed errors should be discoverable by keyboard and assistive technology.
* Never remove focus styling merely for visual preference.

## 19. Screen Readers

Core flows should work with screen readers.

Use:

* Semantic elements.
* Accessible names.
* Appropriate labels.
* Correct heading hierarchy.
* Meaningful link text.
* Appropriate ARIA only when native semantics are insufficient.

Do not add ARIA unnecessarily.

Core flows should be manually checked with **NVDA and/or VoiceOver** where available.

## 20. Headings

* Maintain a logical heading hierarchy.
* Do not skip heading levels merely for visual styling.
* Headings should describe the content that follows.
* Do not use headings solely to make text visually larger.

## 21. Forms and Labels

* Every form control must have an accessible name.
* Labels must identify the purpose of controls.
* Placeholder text must not be the only label.
* Error messages must be associated with the relevant field where appropriate.
* Instructions must be understandable without relying only on color.

## 22. Color and Contrast

* Do not use color as the only means of communicating information.
* Maintain sufficient text and UI contrast.
* Error, warning, and success states must have non-color indicators where necessary.
* Ensure user-configurable brand colors do not make essential public content unusable.

## 23. Motion

* Avoid unnecessary animation.
* Do not use motion that interferes with completing a task.
* Respect reduced-motion preferences where applicable.
* Do not make essential information depend on animation.

## 24. Images and Media

* Provide meaningful alternative text for informative images.
* Use empty alternative text for purely decorative images where appropriate.
* Do not duplicate surrounding text unnecessarily in image alt text.
* Ensure media does not overflow small screens.
* Lazy-load non-critical media.
* Do not autoplay culture videos.

## 25. Video

Culture videos must:

* Use approved providers.
* Have accessible controls through the provider.
* Not autoplay.
* Not prevent normal page navigation.
* Be usable on mobile connections.

## 26. Content Accessibility

* Write clear interface labels.
* Avoid ambiguous action names.
* Avoid unnecessary jargon.
* Ensure long content remains readable.
* Handle long job titles and company names gracefully.
* Do not rely on visual position alone to explain relationships.

## 27. Search and Filters

Job search/filter controls must:

* Be understandable.
* Be keyboard accessible.
* Clearly indicate active filters.
* Allow filters to be cleared.
* Provide a useful no-results state.
* Remain usable on mobile.
* Not expose unpublished or inactive jobs.

## 28. Public Page Accessibility

The public careers page must provide:

* Semantic structure.
* Logical headings.
* Keyboard-accessible navigation.
* Accessible job controls.
* Accessible external application links.
* Responsive content.
* Understandable error and empty states.

## 29. PWA UX

PWA capabilities must preserve normal browser accessibility.

* Installation must not be forced.
* Core functionality should remain understandable without PWA-specific behavior.
* Do not assume offline availability unless explicitly implemented.
* Avoid relying on service-worker behavior for essential accessibility functionality.

## 30. Accessibility Verification

For affected UI, manually verify:

* Mobile usability.
* Keyboard navigation.
* Visible focus.
* Form labels.
* Validation errors.
* Screen-reader semantics.
* Heading hierarchy.
* Color/contrast.
* Touch interaction.
* Responsive layouts.
* Loading states.
* Error states.
* Empty states.

Automated accessibility checks may supplement manual verification but must not replace it.

## 31. UX Change Rule

Before significant UX changes:

1. Check provided UI/component direction.
2. Inspect existing patterns.
3. Check mobile behavior.
4. Check keyboard behavior.
5. Check screen-reader implications.
6. Check loading/error/empty states.
7. Check responsive behavior.
8. Implement the smallest appropriate change.

## 32. Golden Rule

**Every user should be able to understand what is happening, know what they can do next, and complete important workflows regardless of screen size or input method.**
