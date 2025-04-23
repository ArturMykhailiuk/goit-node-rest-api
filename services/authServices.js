import bcrypt from "bcrypt";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "node:path";

import User from "../db/models/Users.js";
import HttpError from "../helpers/HttpError.js";
import { generateToken } from "../helpers/jwt.js";

export const findUser = async (query) => {
  return User.findOne({
    where: query,
  });
};

const signupUser = async (data) => {
  const { email, password } = data.body;

  const avatarURL =
    data.file?.filename || gravatar.url(email, { s: "125", d: "retro" }, true);

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  return User.create({ ...data.body, password: hashPassword, avatarURL });
};

const signinUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    email,
  };

  const token = generateToken(payload);

  await user.update({ token });

  return {
    token,
    user,
  };
};

const logoutUser = async (id) => {
  const user = await findUser({ id });
  if (!user || !user.token) {
    throw HttpError(404, "User not found");
  }

  await user.update({ token: null });
};

const updateSubscription = async (id, { subscription }) => {
  const [updatedRowsCount, [updatedUser]] = await User.update(
    { subscription },
    {
      where: { id },
      returning: true,
    }
  );

  if (!updatedUser) {
    throw HttpError(404, "User not found");
  }

  if (updatedRowsCount === 0) {
    return null;
  }

  return updatedUser;
};

const updateAvatar = async (id, file) => {
  const avatarsDir = path.resolve("public", "avatars");
  const { path: tempPath, filename } = file;

  const avatarPath = path.join(avatarsDir, filename);

  try {
    await fs.rename(tempPath, avatarPath);

    const [updatedRowsCount, [updatedUser]] = await User.update(
      { avatarURL: avatarPath },
      {
        where: { id },
        returning: true,
      }
    );

    if (!updatedUser) {
      throw HttpError(401, "Not authorized");
    }

    if (updatedRowsCount === 0) {
      return null;
    }

    return updatedUser.avatarURL;
  } catch (error) {
    await fs.unlink(tempPath);
    throw "error";
  }
};

export default {
  signupUser,
  signinUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
};
