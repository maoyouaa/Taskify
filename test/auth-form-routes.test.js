const assert = require("node:assert/strict");
const { beforeEach, test } = require("node:test");
const app = require("../src/app");
const { clearUsersForTests } = require("../src/services/auth-store");
const { SESSION_COOKIE } = require("../src/middleware/session");

let emailCounter = 0;

function listen(appInstance) {
  return new Promise((resolve) => {
    const server = appInstance.listen(0, () => resolve(server));
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

async function request(server, path, options = {}) {
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  return fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers: options.headers,
    body: options.body,
    redirect: "manual",
  });
}

function nextEmail(prefix = "alex") {
  emailCounter += 1;
  return `${prefix}.${emailCounter}@example.com`;
}

function getSessionCookie(response) {
  const setCookie = response.headers.get("set-cookie");

  assert.match(setCookie, new RegExp(`^${SESSION_COOKIE}=`));
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /SameSite=Lax/);

  return setCookie.split(";")[0];
}

async function signup(server, overrides = {}) {
  const body = new URLSearchParams({
    SignUpUsername: overrides.username || "Alex",
    SignUpEmail: overrides.email || nextEmail(),
    SignUpPassword: overrides.password || "password123",
  });

  const response = await request(server, "/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/dashboard");

  return getSessionCookie(response);
}

beforeEach(() => {
  clearUsersForTests();
});

test("signup form submission creates a session and redirects to the dashboard", async () => {
  const server = await listen(app);

  try {
    await signup(server, { email: nextEmail("signup") });
  } finally {
    await close(server);
  }
});

test("login form submission verifies stored credentials before redirecting", async () => {
  const server = await listen(app);
  const email = nextEmail("login");

  try {
    await signup(server, { email, password: "password123" });

    const response = await request(server, "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        LoginEmail: email,
        LoginPassword: "password123",
      }),
    });

    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "/dashboard");
    getSessionCookie(response);
  } finally {
    await close(server);
  }
});

test("login form submission rejects unknown accounts", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        LoginEmail: nextEmail("unknown"),
        LoginPassword: "password123",
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.equal(body.errors.credentials, "Email or password is incorrect.");
  } finally {
    await close(server);
  }
});

test("login form submission rejects an incorrect password", async () => {
  const server = await listen(app);
  const email = nextEmail("wrong-password");

  try {
    await signup(server, { email, password: "password123" });

    const response = await request(server, "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        LoginEmail: email,
        LoginPassword: "not-the-password",
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.equal(body.errors.credentials, "Email or password is incorrect.");
  } finally {
    await close(server);
  }
});

test("signup form submission rejects duplicate email addresses", async () => {
  const server = await listen(app);
  const email = nextEmail("duplicate");

  try {
    await signup(server, { email, password: "password123" });

    const response = await request(server, "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        SignUpUsername: "Alex Again",
        SignUpEmail: email.toUpperCase(),
        SignUpPassword: "password123",
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 409);
    assert.equal(body.success, false);
    assert.equal(body.errors.email, "An account already exists for this email address.");
  } finally {
    await close(server);
  }
});

test("auth form submissions reject invalid email input", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        SignUpUsername: "Alex",
        SignUpEmail: "not-an-email",
        SignUpPassword: "password123",
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.errors.email, "Enter a valid email address.");
  } finally {
    await close(server);
  }
});

test("signup form submissions reject short passwords", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        SignUpUsername: "Alex",
        SignUpEmail: nextEmail("short-password"),
        SignUpPassword: "short",
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.errors.password, "Password must be at least 8 characters.");
  } finally {
    await close(server);
  }
});

test("dashboard redirects unauthenticated users to the signup page", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/dashboard");

    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "/signup");
  } finally {
    await close(server);
  }
});

test("dashboard rejects tampered session cookies", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/dashboard", {
      headers: {
        Cookie: `${SESSION_COOKIE}=not-a-valid-session`,
      },
    });

    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "/signup");
  } finally {
    await close(server);
  }
});

test("home page renders the language toggle script", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/");
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /data-lang-value="en"/);
    assert.match(body, /data-lang-value="zh"/);
    assert.match(body, /static\/js\/i18n\.js/);
    assert.match(body, /id="cookie-banner"/);
    assert.match(body, /type="module" src="\/static\/js\/site\.js"/);
  } finally {
    await close(server);
  }
});

test("signup page renders bilingual auth controls", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/signup");
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /data-i18n="signup\.title"/);
    assert.match(body, /data-i18n="login\.title"/);
    assert.match(body, /name="auth-mode-toggle"/);
    assert.match(body, /data-i18n-placeholder="signup\.placeholder\.username"/);
  } finally {
    await close(server);
  }
});

test("favicon requests do not create browser 404 noise", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/favicon.ico");

    assert.equal(response.status, 204);
  } finally {
    await close(server);
  }
});

test("dashboard page renders with the i18n script and task board shell for signed-in users", async () => {
  const server = await listen(app);

  try {
    const cookie = await signup(server, { email: nextEmail("dashboard") });
    const response = await request(server, "/dashboard", {
      headers: {
        Cookie: cookie,
      },
    });
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /data-i18n-document-title="document\.dashboard"/);
    assert.match(body, /id="board-grid"/);
    assert.match(body, /static\/js\/i18n\.js/);
    assert.match(body, /id="cookie-banner"/);
  } finally {
    await close(server);
  }
});

test("privacy page renders the dedicated policy content", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/privacy");
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /data-i18n="privacy\.title"/);
    assert.match(body, /data-i18n="privacy\.collectTitle"/);
    assert.match(body, /href="\/privacy"/);
  } finally {
    await close(server);
  }
});
