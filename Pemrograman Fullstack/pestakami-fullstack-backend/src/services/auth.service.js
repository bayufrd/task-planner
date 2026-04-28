const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const appError = require("../utils/appError");
const { signToken } = require("../utils/jwt");

async function register(payload) {
  const { name, email, password } = payload;

  if (!name || !email || !password) {
    throw appError("name, email, dan password wajib diisi");
  }

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length) {
    throw appError("Email sudah terdaftar", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = uuidv4();

  await pool.query(
    "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
    [id, name, email, passwordHash]
  );

  return { id, name, email };
}

async function login(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    throw appError("email dan password wajib diisi");
  }

  const [rows] = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = ?",
    [email]
  );

  if (!rows.length) {
    throw appError("Email atau password salah", 401);
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw appError("Email atau password salah", 401);
  }

  const token = signToken({
    id: user.id,
    name: user.name,
    email: user.email
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}

async function getMe(userId) {
  const [rows] = await pool.query(
    "SELECT id, name, email, storage_used, storage_limit, created_at FROM users WHERE id = ?",
    [userId]
  );

  if (!rows.length) {
    throw appError("User tidak ditemukan", 404);
  }

  return rows[0];
}

module.exports = { register, login, getMe };
