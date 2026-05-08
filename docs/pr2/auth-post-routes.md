# Deficiency: Auth forms submitted to missing backend routes

## Where the flaw came from

The flaw is in `src/app.js`. The sign-up page renders forms that submit to
`POST /signup` and `POST /login`, but the Express app originally defined only
`GET /`, `GET /signup`, and `GET /dashboard`. Because no POST handlers existed,
submitting either account form reached Express' default 404 handler instead of
continuing the app flow.

Before the fix, `src/app.js` only had this route for the sign-up page:

```js
app.get("/signup", (req, res) => {
    res.status(200).render("signup.ejs");
});
```

A valid browser form submission therefore failed at the backend boundary.

## How the flaw was found

I found it by tracing the form actions in `views/signup.ejs` back to the Express
routes in `src/app.js`. The view submitted account data with `method="post"`, but
there was no matching `app.post(...)` route.

I then reproduced the behavior with a direct HTTP request. Before the fix,
posting valid form data returned `HTTP/1.1 404 Not Found`:

```text
POST /signup
HTTP/1.1 404 Not Found
```

The full command evidence is saved in
`docs/pr2/evidence/auth-post-route-curl.txt`.

## Literature review

Express' routing guide explains that endpoints are matched by both path and HTTP
method. A `GET /signup` route does not handle a `POST /signup` request; the app
needs an `app.post("/signup", handler)` callback for that form submission.

OWASP's Input Validation Cheat Sheet was used for the validation part of the fix.
It recommends validating input on the server side, not just relying on browser
controls. That matters here because direct clients can bypass HTML `required` and
`type="email"` checks.

MDN's documentation for `303 See Other` guided the response pattern. After a
successful form POST, a 303 redirect tells the browser to fetch the next page with
GET. This is a simple Post/Redirect/Get flow and avoids leaving the browser on a
POST response.

Report-ready references in IEEE style:

[1] Express, "Routing." [Online]. Available:
https://expressjs.com/en/guide/routing.html Accessed: May 8, 2026.

[2] OWASP Cheat Sheet Series, "Input Validation Cheat Sheet." [Online].
Available: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
Accessed: May 8, 2026.

[3] MDN Web Docs, "303 See Other." [Online]. Available:
https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/303
Accessed: May 8, 2026.

## Implementation rationale

The implementation adds explicit POST handlers for the two form actions already
present in the UI. It also adds small server-side checks for required fields and
email format before redirecting.

Before:

```js
app.get("/signup", (req, res) => {
    res.status(200).render("signup.ejs");
});
```

After:

```js
app.post("/signup", (req, res) => {
    const missingFields = collectMissingFields(req.body, [
        "SignUpUsername",
        "SignUpEmail",
        "SignUpPassword",
    ]);

    if (missingFields.length > 0 || !isValidEmail(req.body.SignUpEmail)) {
        return res.status(400).json({ success: false, errors: { missingFields } });
    }

    return res.redirect(303, "/dashboard");
});
```

The same pattern was applied to `POST /login`. I also changed `src/app.js` to
export the Express app and only call `listen()` when the file is run directly.
That lets the test suite start the server on a random port without opening the
real application port.

This PR does not implement permanent accounts, password hashing, or sessions.
Those need a separate authentication/persistence task. The scope here is the
backend submission contract: valid form submissions should no longer hit a 404,
and malformed requests should be rejected server-side.

## Before and after evidence

The curl evidence in `docs/pr2/evidence/auth-post-route-curl.txt` shows:

- Before: `POST /signup` returned `404 Not Found`.
- After: `POST /signup` returns `303 See Other` with `Location: /dashboard`.
- After: `POST /login` returns `303 See Other` with `Location: /dashboard`.
- After: invalid email input returns `400 Bad Request` with a JSON validation
  error.

## Verification

Run:

```bash
npm test
```

The test suite covers valid sign-up submission, valid login submission, and
invalid email rejection.
