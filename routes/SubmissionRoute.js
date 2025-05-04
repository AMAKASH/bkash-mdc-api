const express = require("express");
const router = express.Router();
const {
  getAll,
  getAllasAdmin,
  getAllUserSubmissions,
  create,
  updateSubmission,
  uploadImage,
  downloadShortListedSubmissionsZipped,
  getAllGenImageCount,
} = require("../controllers/SubmissionController");
const {
  auth,
  adminAuth,
  allowAuthPassthrough,
} = require("../middleware/authentication");
const uploadSingleFile = require("../utils/uploadSingleFile");

//router.get("/", allowAuthPassthrough, auth, getAll);
router.get("/fetch-as-admin", adminAuth, getAllasAdmin);
router.get("/fetch-as-participant", auth, getAllUserSubmissions);
router.post("/", create);
router.post("/upload-img", uploadImage);
router.put("/:id", adminAuth, updateSubmission);
router.get(
  "/download-shortlisted-images",
  adminAuth,
  downloadShortListedSubmissionsZipped
);

router.get("/all-gen-images", adminAuth, getAllGenImageCount);

module.exports = router;
