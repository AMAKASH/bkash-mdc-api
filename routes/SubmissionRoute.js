const express = require("express");
const router = express.Router();
const {
  getAll,
  getAllasAdmin,
  getAllUserSubmissions,
  create,
  updateSubmission,
} = require("../controllers/SubmissionController");
const {
  auth,
  adminAuth,
  allowAuthPassthrough,
} = require("../middleware/authentication");
const { uploadSingleFile } = require("../utils/uploadSingleFile");

router.get("/", allowAuthPassthrough, auth, getAll);
router.get("/fetch-as-admin", adminAuth, getAllasAdmin);
router.get("/fetch-as-participant", auth, getAllUserSubmissions);
router.post("/", auth, uploadSingleFile("imgFile"), create);
router.put("/:id", adminAuth, updateSubmission);

module.exports = router;
