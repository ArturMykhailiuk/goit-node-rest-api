import authServices from "../services/authServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const signupController = async (req, res) => {
  const newUser = await authServices.signupUser(req);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const signinController = async (req, res) => {
  const { token, user: newUser } = await authServices.signinUser(req.body);

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

  const avatarURL = await authServices.updateAvatar(id, req.file);

  res.status(200).json({
    avatarURL,
  });
};

export default {
  signupController: ctrlWrapper(signupController),
  signinController: ctrlWrapper(signinController),
  getCurrentController: ctrlWrapper(getCurrentController),
  logoutController: ctrlWrapper(logoutController),
  updateSubscriptionController: ctrlWrapper(updateSubscriptionController),
  updateAvatarController: ctrlWrapper(updateAvatarController),
};
