# Member Evidence Checklist

This is an internal audit sheet for the 4-person CPT304 group. It is intentionally
strict: if a branch/PR/doc/screenshot cannot be verified from the current
repository or GitHub-visible history, the item is marked `partial` or `missing`.

## Current audit

| Member | GitHub identity | Real branch | Commit / PR proof | Evidence doc | Screenshot / test proof | Status | Action needed |
| --- | --- | --- | --- | --- | --- | --- | --- |
| You | `maoyouaa` | `feat/i18n-language-toggle` | Commit `8cb0af7`; branch exists on `origin` | `docs/pr3/i18n-language-toggle.md` | `docs/pr3/evidence/` + `verification-tests.txt` | `partial` | Open and merge the PR from `feat/i18n-language-toggle` to `main` after commit/push |
| You | `maoyouaa` | `fix/a11y-auth-form-focus` | Commit `d5deba5`; merged as PR `#1` | `docs/pr1/form-labels.md` | `docs/pr1/evidence/signup-labels-before-after.png` | `complete` | None |
| Member 2 | `peterlololsss` | `fix/auth-form-post-routes` | Commit `b9edfd2`; merged as PR `#5` | `docs/pr2/auth-post-routes.md` | `docs/pr2/evidence/auth-post-route-curl.txt` | `complete` | Confirm this GitHub identity matches the correct teammate name in the report |
| Member 3 | `Min0Nclm` | `fix/user-feedback-task-actions` | Commit `a4d8356`; merged as PR `#4` | Not found in current `docs/` | Not found in current `docs/` | `partial` | Ask for a short technical note plus screenshot/test proof tied to PR `#4` |
| Member 4 | `juiSeIn` | `fix/persistence-validation` | Commit `e0fa07b`; merged as PR `#3` | Not found in current `docs/` | Not found in current `docs/` | `partial` | Ask for a short technical note plus screenshot/test proof tied to PR `#3` |

## Notes for final report use

- Do not rename GitHub identities to real names unless you have confirmed the
  mapping yourself.
- Do not write `complete` for Members 3 or 4 in the final report until their
  missing evidence files are added.
- If needed, `docs/member-proof-log.txt` can be used as a quick supporting log for
  the branches and merge records listed above.

## Suggested message to teammates

Use a direct message in this shape:

> Your branch/PR is visible in GitHub, but your coursework evidence is still
> incomplete in the repository. Please send or add one short technical note plus
> one screenshot or test-proof file that matches your PR so I can mark your
> contribution as complete.
