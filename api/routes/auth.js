const express = require("express");
const { register, login, loginAdmin } = require("../controllers/auth");

const router = express.Router();

// User routes
router.post("/register", register);
router.post("/login", login);
// Admin routes
router.post("/admin/login", loginAdmin);

module.exports = router;
