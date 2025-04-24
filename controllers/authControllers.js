import bcrypt from "bcrypt";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import authServices from "../services/authServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import { findUser } from "../services/authServices.js";
import sendMail from "../helpers/sendMail.js";
import { VerificationLetter } from "../templates/EmailTemplates.js";
import User from "../db/models/Users.js";

const checkUserVerification = (user) => {
  if (user && user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
};

const registerController = async (req, res) => {
  const { email, password } = req.body;
  const verificationToken = nanoid();

  const isExistingUser = await User.findOne({ where: { email } });

  if (isExistingUser && !isExistingUser.verify) {
    res.status(200).json({
      message:
        "This email address is already registered but not verified! A verification letter has been sent. Please check your inbox to complete the verification process.",
    });
  }

  checkUserVerification(isExistingUser);

  if (!isExistingUser) {
    const avatarURL =
      req.file?.filename || gravatar.url(email, { s: "125", d: "retro" }, true);

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await authServices.registerUser(
      req.body,
      hashPassword,
      avatarURL,
      verificationToken
    );

    await sendMail(VerificationLetter(req, email, verificationToken));

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  }
};

const additionalReqForVerificationLetterController = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return next(HttpError(400, "Missing required field: email"));
  }

  const isExistingUser = await findUser({ email });

  checkUserVerification(isExistingUser);

  if (isExistingUser && !isExistingUser.verify) {
    const verificationToken = isExistingUser.verificationToken;

    await sendMail(VerificationLetter(req, email, verificationToken));

    res.status(200).json({ message: "Verification letter sent" });
  }
};

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

  if (!req.file) {
    throw HttpError(400, "File not uploaded");
  }

  const avatarURL = await authServices.updateAvatar(id, req);

  res.status(200).json({
    avatarURL,
  });
};

const getConfirmationForVerificationLetterController = async (
  req,
  res,
  next
) => {
  const { verificationToken } = req.params;
  if (!verificationToken) {
    return next(
      HttpError(400, "Missing required parameter: verification token")
    );
  }

  const isVerifiedUser = await User.findOne({ where: { verificationToken } });
  if (!isVerifiedUser) {
    return next(HttpError(404, "The link no longer active"));
  }

  checkUserVerification(isVerifiedUser);

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
  getConfirmationForVerificationLetterController: ctrlWrapper(
    getConfirmationForVerificationLetterController
  ),
  additionalReqForVerificationLetterController: ctrlWrapper(
    additionalReqForVerificationLetterController
  ),
};
