const express = require("express");
const router = express.Router();
const path = require("path");

const Submission = require("../models/submission");

router.get("/:id", async (req, res) => {
  const submission = await Submission.findById(req.params["id"]);

  if (!submission) {
    return res.status(404).json({ error: "Not found" });
  }
  res.render("imgFrame", { submission });
});

module.exports = router;
