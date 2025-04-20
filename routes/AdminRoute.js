const express = require("express");
const router = express.Router();
const { createAdmin } = require("../controllers/AdminController");

router.post("/", createAdmin);

module.exports = router;