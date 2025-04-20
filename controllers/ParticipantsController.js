const Participant = require("../models/participant.js");
const slugify = require("slugify");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const {
  validateRequestBody,
  getNextSequenceValue,
} = require("../utils/utilityFunctions.js");
const CustomAPIError = require("../errors/custom-api.js");

const Params = {
  completeProfile: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    nid: Joi.string().required(),
    age: Joi.number().required(),
    occupation: Joi.string().required(),
    district: Joi.string().required(),
    division: Joi.string().required(),
    image_link: Joi.string().required(),
  }),
};

const completeProfile = async (req, res, next) => {
  const validated_data = validateRequestBody(Params.completeProfile, req.body);
  const sequence = await getNextSequenceValue();

  const tobeUpdated = await Participant.findById(req.user.userID);

  if (tobeUpdated.profile_complete) {
    throw new CustomAPIError(
      "Profile Information Update Rejected. Information is Locked",
      StatusCodes.FORBIDDEN
    );
  }

  validated_data["profile_complete"] = true;
  validated_data["pid"] = "AOPS2_" + sequence.toString().padStart(2, "0");
  const name_parts = validated_data["name"].split(" ");
  validated_data["display_name"] =
    name_parts[name_parts.length - 1] + ", " + validated_data["pid"];
  validated_data["slug"] = slugify(
    validated_data.name + " " + validated_data.pid,
    { lower: true }
  );

  const participant = await Participant.findByIdAndUpdate(
    req.user.userID,
    validated_data,
    { new: true }
  );

  res.status(StatusCodes.OK).json({
    user: {
      name: participant.name,
      submissions: participant.submission_list,
      pid: participant.pid,
      phone: participant.phone,
      email: participant.email,
      age: participant.age,
      occupation: participant.occupation,
      nid: participant.nid,
      district: participant.district,
      division: participant.division,
      profile_complete: participant.profile_complete,
      slug: participant.slug,
      display_name: participant.display_name,
      image_link: participant.image_link,
    },
  });
};

const getParticipantData = async (req, res) => {
  const participant = await Participant.findById(req.user.userID)
    .populate("submission_list")
    .exec();

  res.status(StatusCodes.OK).json({
    user: {
      name: participant.name,
      submissions: participant.submission_list,
      pid: participant.pid,
      phone: participant.phone,
      email: participant.email,
      age: participant.age,
      occupation: participant.occupation,
      nid: participant.nid,
      district: participant.district,
      division: participant.division,
      profile_complete: participant.profile_complete,
      slug: participant.slug,
      display_name: participant.display_name,
      image_link: participant.image_link,
    },
  });
};

module.exports = {
  completeProfile,
  getParticipantData,
};
