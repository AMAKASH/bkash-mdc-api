const express = require("express");
const router = express.Router();
const {
  completeProfile,
  getParticipantData,
} = require("../controllers/ParticipantsController");
const { auth } = require("../middleware/authentication");

router.post("/completeProfile", auth, completeProfile);
router.get("/getData", auth, getParticipantData);

module.exports = router;
