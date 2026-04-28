const mediaService = require("../services/media.service");

async function getUploadUrl(req, res, next) {
  try {
    const data = await mediaService.getUploadUrl(req.body);
    res.json({ message: "Upload URL berhasil dibuat", data });
  } catch (error) {
    next(error);
  }
}

async function confirmUpload(req, res, next) {
  try {
    const data = await mediaService.confirmUpload(req.body);
    res.status(201).json({ message: "Media berhasil disimpan", data });
  } catch (error) {
    next(error);
  }
}

async function getMediaByEvent(req, res, next) {
  try {
    const data = await mediaService.getMediaByEvent(req.params.id);
    res.json({ message: "Daftar media event", data });
  } catch (error) {
    next(error);
  }
}

async function getMediaDetail(req, res, next) {
  try {
    const data = await mediaService.getMediaDetail(req.params.id);
    res.json({ message: "Detail media", data });
  } catch (error) {
    next(error);
  }
}

async function deleteMedia(req, res, next) {
  try {
    await mediaService.deleteMedia(req.user.id, req.params.id);
    res.json({ message: "Media berhasil dihapus" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUploadUrl,
  confirmUpload,
  getMediaByEvent,
  getMediaDetail,
  deleteMedia
};
