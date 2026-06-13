const express = require("express");
const eventController = require("../controllers/event.controller");
const mediaController = require("../controllers/media.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/public/:slug", eventController.getPublicEvent);

router.use(authMiddleware);
router.post("/", eventController.createEvent);
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEvent);
router.patch("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);
router.get("/:id/media", mediaController.getMediaByEvent);

module.exports = router;
