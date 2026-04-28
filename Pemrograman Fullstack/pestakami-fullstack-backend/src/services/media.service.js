const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const appError = require("../utils/appError");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "video/mp4"];
const MAX_FILE_SIZE = 20 * 1024 * 1024;

async function getUploadUrl(payload) {
  const { eventId, fileName, fileType, fileSize } = payload;

  if (!eventId || !fileName || !fileType || !fileSize) {
    throw appError("eventId, fileName, fileType, dan fileSize wajib diisi");
  }

  if (!ALLOWED_TYPES.includes(fileType)) {
    throw appError("Tipe file tidak didukung");
  }

  if (Number(fileSize) > MAX_FILE_SIZE) {
    throw appError("Ukuran file melebihi 20MB");
  }

  return {
    uploadUrl: `https://storage.example.com/upload/${encodeURIComponent(fileName)}`,
    fileUrl: `https://cdn.example.com/events/${eventId}/${encodeURIComponent(fileName)}`
  };
}

async function confirmUpload(payload) {
  const { eventId, type, url, size, guestName } = payload;

  if (!eventId || !type || !url || !size) {
    throw appError("eventId, type, url, dan size wajib diisi");
  }

  if (!["image", "video"].includes(type)) {
    throw appError("type harus image atau video");
  }

  if (Number(size) > MAX_FILE_SIZE) {
    throw appError("Ukuran file melebihi 20MB");
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [eventRows] = await connection.query(
      `SELECT e.id, e.user_id, e.expired_at, e.is_active, u.storage_used, u.storage_limit
       FROM events e
       JOIN users u ON u.id = e.user_id
       WHERE e.id = ?
       FOR UPDATE`,
      [eventId]
    );

    if (!eventRows.length) {
      throw appError("Event tidak ditemukan", 404);
    }

    const event = eventRows[0];
    const now = new Date();
    const isExpired = event.expired_at ? new Date(event.expired_at) < now : false;

    if (!event.is_active) {
      throw appError("Event nonaktif");
    }

    if (isExpired) {
      throw appError("Event sudah expired");
    }

    if (Number(event.storage_used) + Number(size) > Number(event.storage_limit)) {
      throw appError("Storage owner event penuh");
    }

    const id = uuidv4();

    await connection.query(
      "INSERT INTO media (id, event_id, type, url, size, guest_name) VALUES (?, ?, ?, ?, ?, ?)",
      [id, eventId, type, url, size, guestName || null]
    );

    await connection.query(
      "UPDATE users SET storage_used = storage_used + ? WHERE id = ?",
      [size, event.user_id]
    );

    await connection.commit();

    const [rows] = await pool.query(
      `SELECT id, event_id AS eventId, type, url, size, guest_name AS guestName, created_at AS createdAt
       FROM media WHERE id = ?`,
      [id]
    );

    return rows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getMediaByEvent(eventId) {
  const [rows] = await pool.query(
    `SELECT id, event_id AS eventId, type, url, size, guest_name AS guestName, created_at AS createdAt
     FROM media
     WHERE event_id = ?
     ORDER BY created_at DESC`,
    [eventId]
  );

  return rows;
}

async function getMediaDetail(mediaId) {
  const [rows] = await pool.query(
    `SELECT id, event_id AS eventId, type, url, size, guest_name AS guestName, created_at AS createdAt
     FROM media
     WHERE id = ?`,
    [mediaId]
  );

  if (!rows.length) {
    throw appError("Media tidak ditemukan", 404);
  }

  return rows[0];
}

async function deleteMedia(userId, mediaId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT m.id, m.size, e.user_id
       FROM media m
       JOIN events e ON e.id = m.event_id
       WHERE m.id = ?
       FOR UPDATE`,
      [mediaId]
    );

    if (!rows.length) {
      throw appError("Media tidak ditemukan", 404);
    }

    const media = rows[0];

    if (media.user_id !== userId) {
      throw appError("Forbidden", 403);
    }

    await connection.query("DELETE FROM media WHERE id = ?", [mediaId]);
    await connection.query(
      "UPDATE users SET storage_used = GREATEST(storage_used - ?, 0) WHERE id = ?",
      [media.size, userId]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  getUploadUrl,
  confirmUpload,
  getMediaByEvent,
  getMediaDetail,
  deleteMedia
};
