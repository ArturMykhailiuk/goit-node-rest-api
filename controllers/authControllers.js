import bcrypt from "bcrypt";
import gravatar from "gravatar";
import authServices from "../services/authServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import Users from "../db/models/Users.js";
import HttpError from "../helpers/HttpError.js";
import sendMail from "../helpers/sendMail.js";
import { findUser } from "../services/authServices.js";
import { nanoid } from "nanoid";

const registerController = async (req, res) => {
  const { email, password } = req.body;

  // if (!email) {при існуванні користувача,напевно
  //   return next(HttpError(400, "missing required field email"));
  // }

  const isExistingUser = await findUser({ email });

  if (!isExistingUser) {
    const avatarURL =
      req.file?.filename || gravatar.url(email, { s: "125", d: "retro" }, true);

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await authServices.registerUser(
      req.body,
      hashPassword,
      avatarURL
    );

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  }

  if (isExistingUser && isExistingUser.verify) {
    throw HttpError(409, "Email already in use");
  }

  if (isExistingUser && !isExistingUser.verify) {
    throw HttpError(409, "requires verification.");
  }

  // let verificationToken = null;
  // verificationToken = isExistingUser
  //   ? isExistingUser.verificationToken
  //   : nanoid();

  let verificationToken;

  if (isExistingUser) {
    verificationToken = isExistingUser.verificationToken; // Використовуємо існуючий токен
  } else {
    verificationToken = nanoid(); // Генеруємо новий токен
  }
  console.log("verificationToken", verificationToken);
  const verificationLink = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/verify/${verificationToken}`;

  const emailOptions = {
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking on the following link: ${verificationLink}`,
  };

  try {
    await sendMail(emailOptions);
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(HttpError(500, "Failed to send verification email"));
  }
};

// export const verificationTokenReConfirmationController = async (
//   req,
//   res,
//   next
// ) => {
// const { email } = req.body;

// if (!email) {
//   return next(HttpError(400, "missing required field email"));
// }

// const isVerifiedUser = await Users.findOne({ where: { email } });

// if (!isVerifiedUser) {
// return next(HttpError(404, "User not found"));
// }

// if (isVerifiedUser.verify) {
// return next(HttpError(400, "Verification has already been passed"));
// }

// const verificationLink = `${req.protocol}://${req.get(
//   "host"
// )}/api/auth/verify/${isVerifiedUser.verificationToken}`;

// const emailOptions = {
//   to: email,
//   subject: "Email Verification",
//   text: `Please verify your email by clicking on the following link: ${verificationLink}`,
// };

// try {
//   await sendMail(emailOptions);
//   res.status(200).json({ message: "Verification email sent" });
// } catch (error) {
//   next(HttpError(500, "Failed to send verification email"));
// }
// };

const loginController = async (req, res) => {
  const { token, user: newUser } = await authServices.loginUser(req.body);

  res.json({
    token,
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const getCurrentController = (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logoutController = async (req, res) => {
  const { id } = req.user;
  await authServices.logoutUser(id);
  res.status(204).send();
};

const updateSubscriptionController = async (req, res) => {
  const { id } = req.user;
  const { subscription } = req.body;

  const updatedUser = await authServices.updateSubscription(id, {
    subscription,
  });

  res.status(200).json({
    message: "Subscription updated successfully",
    user: {
      email: updatedUser.email,
      username: updatedUser.username,
      subscription: updatedUser.subscription,
    },
  });
};

const updateAvatarController = async (req, res) => {
  const { id } = req.user;
  console.log(req);
  if (!req.file) {
    throw HttpError(400, "File not uploaded");
  }

  const avatarURL = await authServices.updateAvatar(id, req.file);

  res.status(200).json({
    avatarURL,
  });
};

export const verificationTokenConfirmationController = async (
  req,
  res,
  next
) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    return next(HttpError(400, "Missing verification token parameter"));
  }

  const isVerifiedUser = await Users.findOne({ where: { verificationToken } });

  if (!isVerifiedUser) {
    return next(HttpError(404, "User not found"));
  }

  isVerifiedUser.verificationToken = null;
  isVerifiedUser.verify = true;
  await isVerifiedUser.save();

  res.status(200).json({ message: "Verification successful" });
};

export default {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
  getCurrentController: ctrlWrapper(getCurrentController),
  logoutController: ctrlWrapper(logoutController),
  updateSubscriptionController: ctrlWrapper(updateSubscriptionController),
  updateAvatarController: ctrlWrapper(updateAvatarController),
  verificationTokenConfirmationController: ctrlWrapper(
    verificationTokenConfirmationController
  ),
  // verificationTokenReConfirmationController: ctrlWrapper(
  // verificationTokenReConfirmationController
  // ),
};
