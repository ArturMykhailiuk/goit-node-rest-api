import HttpError from "../helpers/HttpError.js";

const validateAvatar = (req, res, next) => {
  const avatarURL = req.file?.fieldname === "avatarURL";

  if (req.body?.avatarURL) {
    return next(HttpError(400, "Please use form-data for updating avatar"));
  }

  if (!avatarURL) {
    return next(HttpError(400, '"avatarURL" is required'));
  }

  next();
};

export default validateAvatar;
