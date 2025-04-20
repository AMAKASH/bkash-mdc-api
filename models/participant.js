const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const ParticipantSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please Provide Valid Email",
      ],
      unique: true,
    },
    submission_list: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Submission" },
    ],

    daily_submission_count: {
      type: Number,
      default: 0,
    },

    daily_login_attempt: {
      type: Number,
      default: 0,
    },

    last_OTP: {
      type: String,
      default: "15415441515515",
    },
    last_OTP_sent_time: {
      type: Date,
    },
  },
  { timestamps: true }
);

ParticipantSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

module.exports = mongoose.model("Participant", ParticipantSchema);
