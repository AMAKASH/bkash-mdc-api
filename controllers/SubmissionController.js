const Submission = require("../models/submission.js");
const Participant = require("../models/participant.js");
const slugify = require("slugify");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-api.js");

const PROD_MODE = process.env.PROD_MODE === "true";

const checkSubmissionPermissions = (req, participant) => {
  if (PROD_MODE && !req.globalConfigurations.submissions_on) {
    throw new CustomAPIError(
      "Submissions Has not started Yet!! Stop Unauthrorized submission request",
      StatusCodes.FORBIDDEN
    );
  }
  if (
    PROD_MODE &&
    participant.daily_submission_count >=
      req.globalConfigurations.submission_limit_per_day
  ) {
    throw new CustomAPIError(
      "Submission Limit Exceeded. Try Again Tommorrow",
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
  const participant = await Participant.findById(req.user.userID);

  checkSubmissionPermissions(req, participant);
  payload["slug"] = slugify(
    validated_data.name + " " + (participant.submission_list.length + 1),
    { lower: true }
  );

  payload["original_img_fileName"] = req.file.filename;

  const new_submission = await Submission.create(payload);

  await createRenderImage(new_submission);

  participant.submission_list.push(new_submission._id);
  participant.daily_submission_count += 1;
  await participant.save();

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

module.exports = {
  getAll,
  getAllasAdmin,
  getAllUserSubmissions,
  create,
  updateSubmission,
};
