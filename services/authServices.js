import bcrypt from "bcrypt";
import fs from "fs/promises";
import path from "node:path";

import User from "../db/models/Users.js";
import HttpError from "../helpers/HttpError.js";
import { generateToken } from "../helpers/jwt.js";
import sequelize from "../db/Sequelize.js";

export const findUser = async (query) => {
  const user = await User.findOne({ where: query });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  return user;
};

const registerUser = async (
  data,
  hashPassword,
  avatarURL,
  verificationToken
) => {
  const transaction = await sequelize.transaction();

  try {
    const newUser = await User.create(
      {
        ...data,
        password: hashPassword,
        avatarURL,
        verificationToken,
      },
      { transaction }
    );

    await transaction.commit();
    return newUser;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const loginUser = async (data) => {
  const { email, password } = data;

  const user = await findUser({ email });

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
  const avatarsDir = path.join("public", "avatars");
  const uniqueName = `id${id}_${Date.now()}_${file.originalname}`;
  const resultPath = path.join(avatarsDir, uniqueName);
  const tempPath = file.path;

  try {
    await fs.rename(tempPath, resultPath);

    const avatarURL = path.join(path.resolve(), resultPath);

    const [updatedRowsCount, [updatedUser]] = await User.update(
      { avatarURL },
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
  registerUser,
  loginUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
};
