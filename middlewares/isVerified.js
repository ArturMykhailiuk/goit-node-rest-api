import User from "../db/models/Users.js";
import HttpError from "../helpers/HttpError.js";

const isVerified = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(HttpError(400, "Email is required"));
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return next(HttpError(404, "User not found"));
  }

  if (!user.verify) {
    return next(HttpError(403, "Email is not verified"));
  }

  next();
};

export default isVerified;
