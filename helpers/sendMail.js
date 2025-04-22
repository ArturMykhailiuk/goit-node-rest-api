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

  try {
    const transporter = nodemailer.createTransport(config);
    emailOptions.from = config.auth.user;
    const info = await transporter.sendMail(emailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw HttpError(500, "Failed to send email");
  }
};

export default sendMail;
