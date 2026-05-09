# CPT304 Unfinished Coursework Checklist

This file records only the items that are still missing or still unsafe to claim
for submission, based on the current repository state, the coursework brief, and
the current GitHub-visible evidence.

## 1. Report body gaps

- `docs/pr1`, `docs/pr2`, `docs/pr3`, and `docs/pr4` now exist as deficiency
  evidence packs, but they still need to be assembled into the final report.
- `report.pdf` is missing from the repository root, so the final report has not
  been finalized for submission.
- Section 8 still needs at least **4 IEEE-style references** in the final report.

## 2. Baseline standards still incomplete or unproven

### Clearly evidenced now

- Internationalization (i18n): implemented and evidenced in `docs/pr3/evidence/`
- Test coverage `>= 80%`: current `npm run coverage` report shows `90.78%`
  statements and `86.66%` branches
- Lighthouse accessibility `>= 90`: current homepage audit is captured in
  `docs/baseline/evidence/lighthouse-report.report.json` and
  `docs/baseline/evidence/lighthouse-accessibility-score.png` with score `100`
- Legal compliance: cookie banner and privacy policy page are implemented and
  evidenced in `docs/baseline/evidence/`

### Still missing or not yet proven in the current repository

- Live uptime for **7+ consecutive days**
  - missing `live-url.txt`
  - missing deployment evidence screenshot/log

## 3. Required submission files still missing

The coursework ZIP must include four root deliverables. These are still missing
from the repository root:

- `report.pdf`
- `live-url.txt`
- `individual-contribution.xlsx`

## 4. Contribution evidence still incomplete

### You (`maoyouaa`)

- Accessibility contribution is already closed with merged PR evidence.
- Bilingual toggle contribution is now closed with merged PR `#6`.

### Other group members

- `peterlololsss`
  - technical evidence is present
  - still need to confirm the real teammate name mapped to this GitHub identity
- `Min0Nclm`
  - branch/commit/PR exist
  - missing coursework-style technical note
  - missing screenshot or test-proof evidence
- `juiSeIn`
  - persistence deficiency note and screenshot evidence now exist
  - still need to confirm the real teammate name mapped to this GitHub identity

## 5. Consistency tasks before final submission

- update any internal docs that still refer to the i18n PR as `not opened`
- ensure final report text matches current facts:
  - 4 group members
  - current PR numbers
  - current test count
  - actual screenshot filenames
- add figure numbers and captions to every Section 6 screenshot in the final
  report

## 6. Safe interpretation

Until the items above are completed, the project is **not yet safe to submit as a
fully evidenced coursework package**, even though some feature and deficiency
work is already in place.
