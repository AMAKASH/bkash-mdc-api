const axios = require("axios");
const { makeRandomString } = require("./utilityFunctions");

const url = "https://smsplus.sslwireless.com/api/v3/send-sms";

const sendSMS = (recipeient, msg) => {
  const data = {
    api_token: process.env.SMS_API_TOKEN,
    sid: "AOPBRAND",
    msisdn: recipeient,
    sms: msg,
    csms_id: makeRandomString(20),
  };
  axios
    .post(url, data)
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

module.exports = sendSMS;
