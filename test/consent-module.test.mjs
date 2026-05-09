import assert from "node:assert/strict";
import test from "node:test";

import {
  CONSENT_COOKIE,
  parseConsentCookie,
  serialiseConsent,
  shouldShowBanner,
} from "../static/js/modules/consent.mjs";

test("serialiseConsent creates a cookie string with the expected key", () => {
  const cookie = serialiseConsent("accept");

  assert.match(cookie, new RegExp(`^${CONSENT_COOKIE}=accept;`));
  assert.match(cookie, /SameSite=Lax/);
});

test("parseConsentCookie returns the saved choice when present", () => {
  const cookieString = `theme=dark; ${CONSENT_COOKIE}=necessary; session=abc`;

  assert.equal(parseConsentCookie(cookieString), "necessary");
});

test("shouldShowBanner returns true when no consent cookie exists", () => {
  assert.equal(shouldShowBanner("theme=dark"), true);
});

test("shouldShowBanner returns false after a consent choice is stored", () => {
  assert.equal(shouldShowBanner(`${CONSENT_COOKIE}=reject`), false);
});
