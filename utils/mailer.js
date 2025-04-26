const axios = require("axios");

const API_KEY = process.env.RESEND_API_KEY; // Replace with your Resend API key

const sendEmail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "Moments with Maa <no-reply@momentswithmaa.com>",
        to: [to],
        subject,
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent:", response.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.data || error.message
    );
  }
};

module.exports = sendEmail;
