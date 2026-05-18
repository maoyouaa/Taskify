# CPT304 Unfinished Coursework Checklist

This file now records the remaining submission caveats after the repository-wide
evidence pass, based on the current repository state, the coursework brief, and
the current GitHub-visible evidence.

## 1. Report body status

- The authoritative report source is now `report.tex`, which generates
  `report.pdf` through the XeLaTeX build wrapper in `scripts/build_report_pdf.py`.
- The previous Markdown draft is archived at `docs/archive/report-legacy.md`
  for historical reference only.
- The report includes Section 8 references and current baseline figures.
- Remaining manual follow-up:
  - replace any pending teammate real-name placeholders once the team confirms
    the mapping

## 2. Baseline standards status

### Clearly evidenced now

- Internationalization (i18n): implemented and evidenced in `docs/pr3/evidence/`
- Test coverage `>= 80%`: current `npm run coverage` report shows `26/26`
  tests passing, `92.18%` statements, and `84.07%` branches
- Lighthouse accessibility `>= 90`: current homepage audit is captured in
  `docs/baseline/evidence/lighthouse-report.report.json` and
  `docs/baseline/evidence/lighthouse-accessibility-score.png` with score `100`
- Legal compliance: cookie banner and privacy policy page are implemented and
  evidenced in `docs/baseline/evidence/`
- Live uptime for **7+ consecutive days**: evidenced by
  `docs/baseline/evidence/uptime-homepage-2026-05-17.png`,
  `docs/baseline/evidence/uptime-check-2026-05-17.md`, and
  `docs/baseline/uptime-evidence-log.md`

### Remaining baseline gaps

- No baseline-standard evidence gaps remain in the repository.

## 3. Required submission files

The coursework ZIP must include four root deliverables. These are now present in
the repository root:

- `report.pdf`
- `github-url.txt`
- `live-url.txt`
- `individual-contribution.xlsx`

## 4. Contribution evidence follow-up

### You (`maoyouaa`)

- Accessibility contribution is already closed with merged PR evidence.
- Bilingual toggle contribution is now closed with merged PR `#6`.

### Other group members

- `peterlololsss`
  - technical evidence is present
  - still need to confirm the real teammate name mapped to this GitHub identity
- `Min0Nclm`
  - technical evidence pack now exists:
    - `docs/member3-task-feedback-actions.md`
    - `docs/member3-evidence/dashboard-task-actions-proof.png`
    - `docs/member3-evidence/authenticated-dashboard-proof.txt`
  - still need to confirm the real teammate name mapped to this GitHub identity
- `juiSeIn`
  - persistence deficiency note and screenshot evidence now exist
  - still need to confirm the real teammate name mapped to this GitHub identity

## 5. Consistency tasks before final submission

- update any internal docs that still refer to the i18n PR as `not opened`
- ensure final report text in `report.tex` matches current facts:
  - 4 group members
  - current PR numbers
  - current test count: `26`
  - current coverage figures: `92.18%` statements and `84.07%` branches
  - actual screenshot filenames, especially `docs/baseline/evidence/uptime-homepage-2026-05-17.png`
- confirm every Section 6 screenshot in the final PDF keeps its figure number
  and caption after XeLaTeX compilation

## 6. Safe interpretation

The repository is now technically safe to submit as a fully evidenced coursework
package. The remaining manual risk is administrative rather than technical:
teammate real-name mappings should be confirmed in the workbook and report
before final submission.
