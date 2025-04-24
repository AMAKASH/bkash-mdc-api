const Participant = require("../models/participant.js");
const Admin = require("../models/admin.js");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, CustomAPIError } = require("../errors");
const otpGenerator = require("otp-generator");
const sendMail = require("../utils/mailer");
const sendSMS = require("../utils/texter");
const sendEmail = require("../utils/mailer");
const { loginEmailTemplate } = require("../views/emailTemplate.js");

const PROD_MODE = process.env.PROD_MODE === "true";

const reqOTP = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  let participant = await Participant.findOne({ email });
  if (!participant) {
    participant = await Participant.create({
      email,
    });
  }

  if (
    PROD_MODE &&
    participant.last_OTP_sent_time &&
    participant.last_OTP_sent_time.getTime() + 5 * 60 * 1000 > Date.now()
  ) {
    throw new CustomAPIError(
      "Too many requests. Try again after sometimes",
      429
    );
  }

  if (
    PROD_MODE &&
    participant.daily_login_attempt >
      req.globalConfigurations.login_attempt_per_day
  ) {
    throw new CustomAPIError(
      "Too many login attempts for this account, Login Temporarily Banned, Try again Tommorrow",
      429
    );
  }

  const otpCode = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  if (!PROD_MODE) {
    participant.last_OTP = "987654";
  } else {
    participant.last_OTP = otpCode;
  }

  participant.last_OTP_sent_time = Date.now();
  participant.daily_login_attempt += 1;
  await participant.save();
  console.log(otpCode);
  if (PROD_MODE) {
    sendEmail(
      participant.email,
      "Verification OTP - Bkash",
      loginEmailTemplate(otpCode)
    );
  }

  res.status(StatusCodes.OK).json({ msg: "OTP Sent" });
};

const verifyLogin = async (req, res) => {
  console.log(req.body);
  const { email, code } = req.body;
  const participant = await Participant.findOne({ email });
  console.log(participant);

  if (!participant) {
    throw new UnauthenticatedError(
      "Invalid OTP. Please try again with correct OTP"
    );
  }
  if (code != participant.last_OTP) {
    throw new UnauthenticatedError(
      "Invalid OTP.Please try again with correct OTP"
    );
  }

  participant.last_OTP = "-37272893789";
  await participant.save();
  const token = participant.createJWT();

  res.status(StatusCodes.OK).json({
    participant,
    token,
  });
};

const adminLogin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    throw new UnauthenticatedError("Invalid Login Credentials. Try Again");
  }

  const admin = await Admin.findOne({ email: req.body.email, enabled: true });

  if (!admin) {
    throw new UnauthenticatedError("Invalid Login Credentials. Try Again");
  }

  const isPassCorrect = await admin.comparePassword(req.body.password);

  if (!isPassCorrect) {
    throw new UnauthenticatedError("Invalid Login Credentials. Try Again");
  }

  const token = admin.createJWT();

  res.status(StatusCodes.OK).json({ admin, token });
};

module.exports = {
  reqOTP,
  verifyLogin,
  adminLogin,
};
