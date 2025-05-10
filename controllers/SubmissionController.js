const Submission = require("../models/submission.js");
const Participant = require("../models/participant.js");
const slugify = require("slugify");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-api.js");
const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");
const archiver = require("archiver");

const ignore_limit_list = ["+8801779331155", "01779331155", ""];

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

  if (
    submissionCount >= req.globalConfigurations.submission_limit &&
    !ignore_limit_list.includes(payload.bkash_wallet_number.trim())
  ) {
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

const downloadShortListedSubmissionsZipped = async (req, res) => {
  try {
    // Example: replace this with your DB query
    const submissions = await Submission.find({ status: "Shortlisted" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=MWM_images_till_" +
        new Date().toDateString() +
        ".zip"
    );

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    for (const record of submissions) {
      const filePath = path.join("public", record.image_url);
      console.log(filePath);
      const imageStream = fs.createReadStream(filePath);
      archive.append(imageStream, { name: record.slug + ".png" });
    }

    archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating zip file");
  }
};

const getAllGenImageCount = async (req, res) => {
  const uploadDir = path.join("public", "uploads");

  const files = await fsp.readdir(uploadDir, { withFileTypes: true });
  const fileCount = files.filter((dirent) => dirent.isFile()).length;

  res.json({ imageGenCount: fileCount });
};

module.exports = {
  getAll,
  getAllasAdmin,
  getAllUserSubmissions,
  create,
  updateSubmission,
  uploadImage,
  downloadShortListedSubmissionsZipped,
  getAllGenImageCount,
};
