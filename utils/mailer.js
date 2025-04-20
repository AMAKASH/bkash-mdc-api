import { Resend } from "resend";

const sendEmail = async (to, subject, html) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: [to],
    subject,
    html,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
};

module.exports = sendEmail;
