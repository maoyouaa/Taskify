# Auth Session Hardening

## Detection

The previous backend accepted any syntactically valid login request. A user could
submit any email address and any non-empty password to `POST /login` and still be
redirected to `/dashboard`. The dashboard route was also directly accessible by
requesting `GET /dashboard` without a session. That meant the form submission
contract existed, but the backend did not yet verify identity before allowing the
protected task board page to load.

## External guidance used

- OWASP Authentication Cheat Sheet: authentication should verify supplied
  authenticators, store passwords securely, and compare password hashes using
  safe comparison functions.
- OWASP Session Management Cheat Sheet: authenticated state should be carried by
  a hard-to-predict session identifier, and cookies should use protections such
  as `HttpOnly` and `SameSite`.

References:

- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html

## Implementation summary

- Added an in-memory auth store for the prototype signup/login flow.
- Normalised email addresses before account lookup.
- Hashed passwords with Node's built-in `crypto.scrypt` before storage.
- Compared password hashes using `crypto.timingSafeEqual`.
- Issued a signed `taskify_session` cookie after signup/login.
- Set session cookies with `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Max-Age`.
- Protected `GET /dashboard`; unauthenticated or tampered-session requests now
  redirect to `/signup`.
- Added `POST /logout` to clear the session cookie.
- Added a small `/favicon.ico` 204 response to remove browser 404 noise during
  runtime checks.

## Validation

Automated tests cover:

- signup redirects and sets a protected session cookie;
- login succeeds only after a matching signup;
- unknown email and wrong password return `401`;
- duplicate signup returns `409`;
- invalid email and short passwords return `400`;
- dashboard blocks unauthenticated and tampered-session requests;
- dashboard renders normally with a valid session;
- favicon requests no longer produce a browser 404.

Runtime smoke checks were also run against a local server with curl and Chrome
DevTools MCP. The signup -> dashboard flow loaded successfully, unauthenticated
dashboard requests redirected to `/signup`, wrong-password login returned `401`,
logout cleared the session, and the browser network panel showed no local 404s.

## Known scope limit

The store is intentionally in-memory because this coursework app does not yet
have a configured production database. It is suitable for proving the backend
authentication contract and session protection, but a permanent database-backed
user model would be needed before treating accounts as durable production data.
