const mongoose = require("mongoose");
const SubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
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
    image_url: {
      type: String,
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
