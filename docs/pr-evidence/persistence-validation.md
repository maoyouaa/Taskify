# PR Evidence: fix/persistence-validation

## Coursework mapping

- Deficiency: missing state persistence.
- Deficiency: weak input validation and unsafe content handling.
- Suggested literature: MDN Web Storage API and OWASP Input Validation Cheat Sheet.

## Changed what

- Replaced the static dashboard cards with a working task board.
- Added `localStorage` persistence so task state survives a page refresh.
- Added validation for required titles, maximum lengths, allowed status/priority values, dates, and duplicate tasks.
- Rendered user-entered task content with text nodes instead of injecting HTML.
- Added unit tests for task normalisation, validation, duplicate detection, grouping, filtering, safe load, and metrics.

## Evidence to capture

- Save a new task, refresh `/dashboard`, and confirm the task remains visible.
- Try saving an empty title and confirm the error message appears.
- Try saving a duplicate title/details pair and confirm it is rejected.
- Run `npm test` or `node --test tests/task-store.test.mjs`.
