# Baseline Evidence Summary

This note records the current baseline-standard evidence that can already be
claimed from the repository and local verification files.

## 1. Internationalization

- Scope: bilingual toggle across the home page, auth page, and dashboard flow
- Evidence:
  - `docs/pr3/i18n-language-toggle.md`
  - `docs/pr3/evidence/home-en.png`
  - `docs/pr3/evidence/home-zh.png`
  - `docs/pr3/evidence/signup-zh.png`
  - `docs/pr3/evidence/dashboard-zh.png`
  - `docs/pr3/evidence/verification-tests.txt`

## 2. Test coverage >= 80%

- Verification command: `npm run coverage`
- Current result:
  - Tests passed: `26/26`
  - Statements: `92.18%`
  - Branches: `84.07%`
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

## 5. Live uptime for 7+ consecutive days

- Production URL:
  - `live-url.txt`
- Current result:
  - Vercel history captured on `2026-05-17` includes production deployments aged
    `7d` and `17d`
  - Production alias was still reachable on `2026-05-17`
- Evidence:
  - `docs/baseline/evidence/vercel-7day-log.md`
  - `docs/baseline/evidence/vercel-7day-log.html`
  - `docs/baseline/evidence/vercel-7day-log.png`
  - `docs/baseline/uptime-evidence-log.md`
  - `docs/baseline/evidence/uptime-check-2026-05-17.md`
  - `docs/baseline/evidence/uptime-homepage-2026-05-17.png`

## 6. Current baseline status

- The baseline standards claimed in the coursework brief are now evidenced in the
  repository.
- The final report should cite the exact filenames above rather than older draft
  names.
