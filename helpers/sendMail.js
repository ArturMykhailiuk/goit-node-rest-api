import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (emailOptions) => {
  const config = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);

  emailOptions.from = config.auth.user;

  transporter
    .sendMail(emailOptions)
    .then((info) => console.log("Email sent:", info))
    .catch((err) => console.error("Error sending email:", err));
};

export default sendMail;
