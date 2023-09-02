const express = require("express");
const verifyToken = require("../middleware/auth");
const { getLastUsers, getLastImages } = require("../controllers/admin");

const router = express.Router();

router.get("/last-users", verifyToken, getLastUsers);
router.get("/last-images", verifyToken, getLastImages);

module.exports = router;
