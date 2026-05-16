const crypto = require("crypto");

const SESSION_COOKIE = "taskify_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const SESSION_SECRET = resolveSessionSecret();
const revokedSessionIds = new Set();

function resolveSessionSecret() {
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    return "taskify-development-session-secret";
  }

  console.warn("SESSION_SECRET is not set; using a generated per-process secret for this runtime.");
  return crypto.randomBytes(32).toString("hex");
}

function parseCookies(cookieHeader) {
  return String(cookieHeader || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separatorIndex = part.indexOf("=");

      if (separatorIndex === -1) {
        return cookies;
      }

      const name = part.slice(0, separatorIndex);
      const value = part.slice(separatorIndex + 1);

      try {
        cookies[name] = decodeURIComponent(value);
      } catch (error) {
        return cookies;
      }

      return cookies;
    }, {});
}

function sign(value) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function createSessionToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const sessionId = crypto.randomUUID();
  const payload = Buffer.from(
    JSON.stringify({
      sid: sessionId,
      userId: user.id,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      iat: now,
      exp: now + SESSION_MAX_AGE_SECONDS,
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token) {
  const [payload, signature] = String(token || "").split(".");

  if (!payload || !signature || !safeEqual(sign(payload), signature)) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);

    if (
      !session.sid ||
      !session.userId ||
      typeof session.exp !== "number" ||
      session.exp <= now ||
      revokedSessionIds.has(session.sid)
    ) {
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
}

function getSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  return verifySessionToken(cookies[SESSION_COOKIE]);
}

function revokeSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  const session = verifySessionToken(cookies[SESSION_COOKIE]);

  if (session) {
    revokedSessionIds.add(session.sid);
  }
}

function createSessionCookie(user) {
  const attributes = [
    `${SESSION_COOKIE}=${encodeURIComponent(createSessionToken(user))}`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
  ];

  if (process.env.NODE_ENV === "production") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

module.exports = {
  SESSION_COOKIE,
  clearSessionCookie,
  createSessionCookie,
  getSession,
  parseCookies,
  revokeSession,
  verifySessionToken,
};
