export const VerificationLetter = (data, useremail, verToken) => {
  const verificationLink = `${data.protocol}://${data.get(
    "host"
  )}/api/auth/verify/${verToken}`;

  const emailOptions = {
    to: useremail,
    subject: "Email Verification",
    text: `Please verify your email by clicking on the following link: ${verificationLink}`,
  };
  return emailOptions;
};
