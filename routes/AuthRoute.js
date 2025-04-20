const express = require("express");
const router = express.Router();
const { reqOTP, verifyLogin, adminLogin } = require("../controllers/AuthController");

router.post("/requestAuth", reqOTP);
router.post("/verifyAuth", verifyLogin);
router.post("/admin", adminLogin);

module.exports = router;
