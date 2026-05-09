export const CONSENT_COOKIE = "taskify_consent";

export function parseConsentCookie(cookieString = "") {
  const pair = cookieString
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));

  if (!pair) {
    return "";
  }

  return decodeURIComponent(pair.split("=")[1] || "");
}

export function serialiseConsent(value) {
  return `${CONSENT_COOKIE}=${encodeURIComponent(value)}; Max-Age=${60 * 60 * 24 * 180}; Path=/; SameSite=Lax`;
}

export function shouldShowBanner(cookieString = "") {
  return parseConsentCookie(cookieString) === "";
}
