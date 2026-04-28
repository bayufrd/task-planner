const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const appError = require("../utils/appError");

async function createEvent(userId, payload) {
  const { name, slug, location, coverUrl, eventDate, expiredAt } = payload;

  if (!name || !slug) {
    throw appError("name dan slug wajib diisi");
  }

  const [slugRows] = await pool.query("SELECT id FROM events WHERE slug = ?", [slug]);
  if (slugRows.length) {
    throw appError("Slug event sudah digunakan", 409);
  }

  const id = uuidv4();

  await pool.query(
    `INSERT INTO events
      (id, user_id, name, slug, location, cover_url, event_date, expired_at, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [id, userId, name, slug, location || null, coverUrl || null, eventDate || null, expiredAt || null]
  );

  return getEventById(userId, id);
}

async function getEventsByUser(userId) {
  const [rows] = await pool.query(
    `SELECT id, name, slug, location, cover_url AS coverUrl, event_date AS eventDate,
            expired_at AS expiredAt, is_active AS isActive, created_at AS createdAt
     FROM events
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
}

async function getEventById(userId, eventId) {
  const [rows] = await pool.query(
    `SELECT id, name, slug, location, cover_url AS coverUrl, event_date AS eventDate,
            expired_at AS expiredAt, is_active AS isActive, created_at AS createdAt
     FROM events
     WHERE id = ? AND user_id = ?`,
    [eventId, userId]
  );

  if (!rows.length) {
    throw appError("Event tidak ditemukan", 404);
  }

  return rows[0];
}

async function updateEvent(userId, eventId, payload) {
  const current = await getEventById(userId, eventId);
  const next = {
    name: payload.name ?? current.name,
    slug: payload.slug ?? current.slug,
    location: payload.location ?? current.location,
    coverUrl: payload.coverUrl ?? current.coverUrl,
    eventDate: payload.eventDate ?? current.eventDate,
    expiredAt: payload.expiredAt ?? current.expiredAt,
    isActive: payload.isActive ?? current.isActive
  };

  if (next.slug !== current.slug) {
    const [slugRows] = await pool.query("SELECT id FROM events WHERE slug = ? AND id <> ?", [next.slug, eventId]);
    if (slugRows.length) {
      throw appError("Slug event sudah digunakan", 409);
    }
  }

  await pool.query(
    `UPDATE events
     SET name = ?, slug = ?, location = ?, cover_url = ?, event_date = ?, expired_at = ?, is_active = ?
     WHERE id = ? AND user_id = ?`,
    [next.name, next.slug, next.location, next.coverUrl, next.eventDate, next.expiredAt, Number(Boolean(next.isActive)), eventId, userId]
  );

  return getEventById(userId, eventId);
}

async function deleteEvent(userId, eventId) {
  const [result] = await pool.query("DELETE FROM events WHERE id = ? AND user_id = ?", [eventId, userId]);

  if (!result.affectedRows) {
    throw appError("Event tidak ditemukan", 404);
  }
}

async function getPublicEvent(slug) {
  const [rows] = await pool.query(
    `SELECT e.id, e.name, e.slug, e.location, e.cover_url AS coverUrl, e.event_date AS eventDate,
            e.expired_at AS expiredAt, e.is_active AS isActive,
            u.storage_used AS storageUsed, u.storage_limit AS storageLimit
     FROM events e
     JOIN users u ON u.id = e.user_id
     WHERE e.slug = ?`,
    [slug]
  );

  if (!rows.length) {
    throw appError("Event tidak ditemukan", 404);
  }

  const event = rows[0];
  const now = new Date();
  const expired = event.expiredAt ? new Date(event.expiredAt) < now : false;
  const uploadEnabled = Boolean(event.isActive) && !expired && event.storageUsed < event.storageLimit;

  return {
    ...event,
    storageRemaining: Math.max(0, Number(event.storageLimit) - Number(event.storageUsed)),
    uploadEnabled,
    uploadDisabledReason: uploadEnabled ? null : "Event nonaktif, expired, atau storage penuh"
  };
}

module.exports = {
  createEvent,
  getEventsByUser,
  getEventById,
  updateEvent,
  deleteEvent,
  getPublicEvent
};
