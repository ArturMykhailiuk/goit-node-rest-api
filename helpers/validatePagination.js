import HttpError from "../helpers/HttpError.js";
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (!Number.isInteger(+page) || +page <= 0)) {
    return next(HttpError(400, "Page must be a positive integer"));
  }

  if (limit && (!Number.isInteger(+limit) || +limit <= 0)) {
    return next(HttpError(400, "Limit must be a positive integer"));
  }

  next();
};

export default validatePagination;
