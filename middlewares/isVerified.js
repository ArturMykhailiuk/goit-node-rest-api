import User from "../db/models/Users.js";
import HttpError from "../helpers/HttpError.js";
import { findUser } from "../services/authServices.js";

const isVerified = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(HttpError(400, "Email is required"));
  }

  const user = await findUser({ email });

  if (!user.verify) {
    return next(HttpError(403, "Email is not verified"));
  }

  next();
};

export default isVerified;
