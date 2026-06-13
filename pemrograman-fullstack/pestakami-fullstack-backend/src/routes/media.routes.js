const express = require("express");
const mediaController = require("../controllers/media.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/upload-url", mediaController.getUploadUrl);
router.post("/confirm", mediaController.confirmUpload);
router.get("/:id", mediaController.getMediaDetail);
router.delete("/:id", authMiddleware, mediaController.deleteMedia);

module.exports = router;
