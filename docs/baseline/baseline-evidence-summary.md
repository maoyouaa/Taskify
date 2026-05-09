# Baseline Evidence Summary

This note records the current baseline-standard evidence that can already be
claimed from the repository and local verification files.

## 1. Internationalization

- Scope: bilingual toggle across the home page, auth page, and dashboard flow
- Evidence:
  - `docs/pr3/i18n-language-toggle.md`
  - `docs/pr3/evidence/home-en-home-zh.png`
  - `docs/pr3/evidence/signup-en-signup-zh.png`
  - `docs/pr3/evidence/dashboard-en-dashboard-zh.png`
  - `docs/pr3/evidence/verification-tests.txt`

## 2. Test coverage >= 80%

- Verification command: `npm run coverage`
- Current result:
  - Statements: `90.78%`
  - Branches: `86.66%`
- Evidence:
  - `docs/baseline/evidence/coverage-summary.txt`
  - `docs/baseline/evidence/coverage-report.png`

## 3. Accessibility >= 90

- Verification command:
  - `npx lighthouse http://127.0.0.1:3053/ --only-categories=accessibility --output=json --output=html --output-path=docs/baseline/evidence/lighthouse-report`
- Current result:
  - Homepage accessibility score: `100`
- Evidence:
  - `docs/baseline/evidence/lighthouse-accessibility-score.png`
  - `docs/baseline/evidence/lighthouse-report.report.html`
  - `docs/baseline/evidence/lighthouse-report.report.json`

## 4. Legal compliance

- Implemented items:
  - cookie consent banner
  - privacy policy page at `/privacy`
- Evidence:
  - `docs/baseline/evidence/cookie-banner.png`
  - `docs/baseline/evidence/privacy-page.png`

## 5. Still outstanding

- Live uptime for 7+ consecutive days is still not evidenced in the current
  repository.
- `live-url.txt` is still missing and should only be created after a real
  deployment URL and uptime record are available.
