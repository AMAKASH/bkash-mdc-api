const mongoose = require("mongoose");
const SubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true,
    },

    contact_info: {
      type: String,
      required: true,
    },

    story: {
      type: String,
      required: true,
    },

    bkash_wallet_number: {
      type: String,
      required: true,
    },
    original_img_fileName: {
      type: String,
      required: true,
    },

    gen_img_url: {
      type: String,
      required: true,
    },

    gen_img_fileName: {
      type: String,
      required: true,
    },

    left: {
      type: Number,
      required: true,
    },

    top: {
      type: Number,
      required: true,
    },

    scale: {
      type: Number,
      required: true,
    },

    slug: {
      type: String,
    },

    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", SubmissionSchema);
