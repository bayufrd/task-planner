const eventService = require("../services/event.service");

async function createEvent(req, res, next) {
  try {
    const data = await eventService.createEvent(req.user.id, req.body);
    res.status(201).json({ message: "Event berhasil dibuat", data });
  } catch (error) {
    next(error);
  }
}

async function getEvents(req, res, next) {
  try {
    const data = await eventService.getEventsByUser(req.user.id);
    res.json({ message: "Daftar event", data });
  } catch (error) {
    next(error);
  }
}

async function getEvent(req, res, next) {
  try {
    const data = await eventService.getEventById(req.user.id, req.params.id);
    res.json({ message: "Detail event", data });
  } catch (error) {
    next(error);
  }
}

async function updateEvent(req, res, next) {
  try {
    const data = await eventService.updateEvent(req.user.id, req.params.id, req.body);
    res.json({ message: "Event berhasil diupdate", data });
  } catch (error) {
    next(error);
  }
}

async function deleteEvent(req, res, next) {
  try {
    await eventService.deleteEvent(req.user.id, req.params.id);
    res.json({ message: "Event berhasil dihapus" });
  } catch (error) {
    next(error);
  }
}

async function getPublicEvent(req, res, next) {
  try {
    const data = await eventService.getPublicEvent(req.params.slug);
    res.json({ message: "Detail public event", data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getPublicEvent
};
