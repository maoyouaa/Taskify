import {
  parseConsentCookie,
  serialiseConsent,
  shouldShowBanner,
} from "./modules/consent.mjs";

function bindCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) {
    return;
  }

  banner.hidden = !shouldShowBanner(document.cookie);

  banner.querySelectorAll("[data-consent-action]").forEach((button) => {
    button.addEventListener("click", () => {
      document.cookie = serialiseConsent(button.dataset.consentAction || "necessary");
      banner.hidden = true;
    });
  });

  if (parseConsentCookie(document.cookie)) {
    banner.hidden = true;
  }
}

bindCookieBanner();
