const crypto = require("crypto");

const PASSWORD_KEY_LENGTH = 64;
const DUMMY_PASSWORD_HASH = `taskify-dummy-salt:${crypto
  .scryptSync("taskify-dummy-password", "taskify-dummy-salt", PASSWORD_KEY_LENGTH)
  .toString("hex")}`;
const usersByEmail = new Map();
const usersById = new Map();
const pendingEmails = new Set();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(String(password), salt, PASSWORD_KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

async function verifyPassword(password, storedHash) {
  const [salt, key] = String(storedHash || "").split(":");

  if (!salt || !key) {
    return false;
  }

  const candidateHash = await hashPassword(password, salt);
  const candidateKey = Buffer.from(candidateHash.split(":")[1], "hex");
  const storedKey = Buffer.from(key, "hex");

  if (candidateKey.length !== storedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(candidateKey, storedKey);
}

function toPublicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

async function createUser({ username, email, password }) {
  const normalizedEmail = normalizeEmail(email);

  if (usersByEmail.has(normalizedEmail) || pendingEmails.has(normalizedEmail)) {
    return { ok: false, reason: "duplicate-email" };
  }

  pendingEmails.add(normalizedEmail);

  try {
    const user = {
      id: crypto.randomUUID(),
      username: String(username || "").trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    usersByEmail.set(normalizedEmail, user);
    usersById.set(user.id, user);

    return { ok: true, user: toPublicUser(user) };
  } finally {
    pendingEmails.delete(normalizedEmail);
  }
}

async function verifyCredentials(email, password) {
  const user = usersByEmail.get(normalizeEmail(email));
  const passwordHash = user ? user.passwordHash : DUMMY_PASSWORD_HASH;
  const matches = await verifyPassword(password, passwordHash);

  return user && matches ? toPublicUser(user) : null;
}

function getUserById(userId) {
  return toPublicUser(usersById.get(userId));
}

function clearUsersForTests() {
  usersByEmail.clear();
  usersById.clear();
  pendingEmails.clear();
}

module.exports = {
  clearUsersForTests,
  createUser,
  getUserById,
  normalizeEmail,
  verifyCredentials,
};
