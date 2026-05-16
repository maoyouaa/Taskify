const assert = require("node:assert/strict");
const test = require("node:test");
const app = require("../src/app");

function listen(appInstance) {
  return new Promise((resolve) => {
    const server = appInstance.listen(0, () => resolve(server));
  });
}

async function request(server, path, body) {
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  return fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
    redirect: "manual",
  });
}

async function get(server, path) {
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  return fetch(`${baseUrl}${path}`);
}

test("public pages render successfully", async () => {
  const server = await listen(app);

  try {
    const responses = await Promise.all([
      get(server, "/"),
      get(server, "/signup"),
      get(server, "/dashboard"),
    ]);

    assert.deepEqual(responses.map((response) => response.status), [200, 200, 200]);
  } finally {
    server.close();
  }
});

test("signup form submission redirects to the dashboard", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/signup", {
      SignUpUsername: "Alex",
      SignUpEmail: "alex@example.com",
      SignUpPassword: "password123",
    });

    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "/dashboard");
  } finally {
    server.close();
  }
});

test("signup form submission rejects missing required fields", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/signup", {
      SignUpUsername: "",
      SignUpEmail: "alex@example.com",
      SignUpPassword: "",
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.deepEqual(body.errors.missingFields, ["SignUpUsername", "SignUpPassword"]);
  } finally {
    server.close();
  }
});

test("login form submission redirects to the dashboard", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/login", {
      LoginEmail: "alex@example.com",
      LoginPassword: "password123",
    });

    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "/dashboard");
  } finally {
    server.close();
  }
});

test("login form submission rejects missing required fields", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/login", {
      LoginEmail: "",
      LoginPassword: "",
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.deepEqual(body.errors.missingFields, ["LoginEmail", "LoginPassword"]);
  } finally {
    server.close();
  }
});

test("login form submission rejects invalid email input", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/login", {
      LoginEmail: "not-an-email",
      LoginPassword: "password123",
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.errors.email, "Enter a valid email address.");
  } finally {
    server.close();
  }
});

test("auth form submissions reject invalid email input", async () => {
  const server = await listen(app);

  try {
    const response = await request(server, "/signup", {
      SignUpUsername: "Alex",
      SignUpEmail: "not-an-email",
      SignUpPassword: "password123",
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.errors.email, "Enter a valid email address.");
  } finally {
    server.close();
  }
});
