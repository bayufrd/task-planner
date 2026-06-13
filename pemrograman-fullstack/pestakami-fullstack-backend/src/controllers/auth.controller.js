const authService = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const data = await authService.register(req.body);
    res.status(201).json({ message: "Register berhasil", data });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    res.json({ message: "Login berhasil", data });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const data = await authService.getMe(req.user.id);
    res.json({ message: "Profile user", data });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, me };
