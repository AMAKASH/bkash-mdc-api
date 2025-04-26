const Submission = require("../models/submission.js");
const Participant = require("../models/participant.js");
const slugify = require("slugify");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-api.js");
const fs = require("fs");
const path = require("path");

const PROD_MODE = process.env.PROD_MODE === "true";

const checkSubmissionPermissions = (req) => {
  if (PROD_MODE && !req.globalConfigurations.submissions_on) {
    throw new CustomAPIError(
      "Submissions Has not started Yet!! Stop Unauthrorized submission request",
      StatusCodes.FORBIDDEN
    );
  }
};

const getAll = async (req, res) => {
  const submissions = await Submission.find().sort("-createdAt");
  res.status(StatusCodes.OK).json({ submissions });
};

const getAllUserSubmissions = async (req, res) => {
  const user_id = req.user.userID;
  const submissions = await Submission.find({ participant: user_id });

  res.status(StatusCodes.OK).json({ submissions });
};

const getAllasAdmin = async (req, res) => {
  const submissions = await Submission.find().sort("-createdAt");

  res.status(StatusCodes.OK).json({ submissions });
};

const createRenderImage = async (submission) => {
  const dir = `./public/renders/`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  try {
    const filePath = `${dir}/${submission._id}.png`;
    const response = await axios.post(
      `http://localhost:${process.env.BROWSER_PORT}/screenshot/${submission._id}`,
      {
        destinationFilePath: filePath,
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to generate Image on Server");
    }

    submission.gen_img_fileName = submission._id + ".png";
    submission.url = filePath.replace("./public", "");
    await submission.save();
  } catch (error) {
    console.error("Error fetching screenshot:", error);
  }
};

const create = async (req, res) => {
  const payload = req.body;

  checkSubmissionPermissions(req);
  payload["slug"] = slugify(
    payload.name + " " + payload.bkash_wallet_number + " " + Date.now(),
    { lower: true }
  );

  const submissionCount = await Submission.countDocuments({
    bkash_wallet_number: payload.bkash_wallet_number,
  });

  if (submissionCount >= req.globalConfigurations.submission_limit) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Submissions limit with this bKash wallet number exceeded.",
    });
  }

  const new_submission = await Submission.create(payload);

  return res.status(StatusCodes.CREATED).json({ submission: new_submission });
};

const updateSubmission = async (req, res) => {
  const submission_id = req.params.id;
  const validated_data = req.body;

  const submission = await Submission.findByIdAndUpdate(
    submission_id,
    validated_data,
    { new: true }
  );

  res.status(StatusCodes.ACCEPTED).json(submission);
};

const uploadImage = async (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: "Missing imageData or filename" });
  }

  const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  // Ensure public/uploads exists
  const uploadDir = path.join("public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.png`;

  const filePath = path.join(uploadDir, filename);

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error("Error saving image:", err);
      return res.status(500).json({ error: "Failed to save image" });
    }
    const publicUrl = `/uploads/${filename}`;
    res.json({ msg: "Image saved successfully", url: publicUrl });
  });
};

module.exports = {
  getAll,
  getAllasAdmin,
  getAllUserSubmissions,
  create,
  updateSubmission,
  uploadImage,
};
