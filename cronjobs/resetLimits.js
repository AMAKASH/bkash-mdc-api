const Participant = require("../models/participant.js");

const resetLimits = async () => {
  console.log("Running Cronjob:resetSubmissionVoteLimit at 12.00AM");
  await Participant.updateMany(
    {},
    { daily_submission_count: 0, daily_login_attempt: 0 }
  );
  console.log("Participant Limits was reset");
};

module.exports = resetLimits;
