# Personal Evidence: `feat/i18n-language-toggle`

## Problem

The coursework fork still behaved as a single-language interface. The landing
page, auth page, and dashboard all rendered English-only copy, which meant the
project could not honestly claim a bilingual UI contribution for the final
report.

## Your change

I implemented a persistent English/Chinese language toggle for the current
coursework UI and limited the claim to the pages that are now genuinely covered:

- `/`
- `/signup`
- `/dashboard`

The toggle stores the selected language in `localStorage`, applies translated
text on load, updates placeholders/button values/ARIA labels, and re-renders the
dashboard board chrome when the language changes.

## Files / area affected

- `static/js/i18n.js`
- `static/js/dashboard.js`
- `views/index.ejs`
- `views/signup.ejs`
- `views/dashboard/dashboard.ejs`
- `views/partials/nav.ejs`
- `views/partials/hero.ejs`
- `views/partials/feature.ejs`
- `views/partials/achievements.ejs`
- `views/partials/footer.ejs`
- `views/partials/dashboard/navbar-dashboard.ejs`
- `views/partials/dashboard/dashboard-sidebar.ejs`
- `views/partials/dashboard/dashboard-cards.ejs`

## Proof on GitHub

- Branch: `feat/i18n-language-toggle`
- Current GitHub-visible commit: `e30258c29e7a6ccef9d306208e5fd5d33b162998`
- Author: `maoyouaa <136690485+maoyouaa@users.noreply.github.com>`
- Remote branch path: `origin/feat/i18n-language-toggle`
- Open PR: `#6` - `feat: add bilingual language toggle evidence`

The current branch already exists on GitHub and now has an open PR to `main`.
This contribution remains open until PR `#6` is merged.

## Local evidence

- Git proof: `docs/pr3/evidence/git-proof.txt`
- Browser check note: `docs/pr3/evidence/browser-check.txt`
- English home screenshot: `docs/pr3/evidence/home-en.png`
- Chinese home screenshot: `docs/pr3/evidence/home-zh.png`
- Chinese signup screenshot: `docs/pr3/evidence/signup-zh.png`
- Chinese dashboard screenshot: `docs/pr3/evidence/dashboard-zh.png`
- Test output: `docs/pr3/evidence/verification-tests.txt`

## Verification result

Local verification on the current branch confirms:

- the home page renders the language switch and translated navigation/content
- the signup page renders bilingual auth controls and translated labels
- the dashboard renders translated navigation, metrics, form labels, and seeded
  task-board content
- the selected language persists through `localStorage`
- current server tests pass with `6/6`

## Report-ready wording

Use the contribution claim below in the final report:

> Implemented and validated a bilingual English/Chinese language toggle for the
> coursework UI across the landing page, auth page, and dashboard, with
> persistent client-side language state and screenshot-based evidence.

## Remaining action

- Merge PR `#6` into `main`, then update the contribution checklist from
  `partial` to `complete`.
