const assert = require("node:assert/strict");
const test = require("node:test");
const app = require("../src/app");

function listen(appInstance) {
  return new Promise((resolve) => {
    const server = appInstance.listen(0, () => resolve(server));
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

test("signup form submission redirects to the dashboard", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        SignUpUsername: "Alex",
        SignUpEmail: "alex@example.com",
        SignUpPassword: "password123",
      }),
    });

    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "/dashboard");
  } finally {
    server.close();
  }
});

test("login form submission redirects to the dashboard", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        LoginEmail: "alex@example.com",
        LoginPassword: "password123",
      }),
    });

    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "/dashboard");
  } finally {
    server.close();
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
    server.close();
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
    server.close();
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
    assert.match(body, /data-i18n-placeholder="signup\.placeholder\.username"/);
  } finally {
    server.close();
  }
});

test("dashboard page renders with the i18n script and task board shell", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/dashboard");
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /data-i18n-document-title="document\.dashboard"/);
    assert.match(body, /id="board-grid"/);
    assert.match(body, /static\/js\/i18n\.js/);
    assert.match(body, /id="cookie-banner"/);
  } finally {
    server.close();
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
    server.close();
  }
});
