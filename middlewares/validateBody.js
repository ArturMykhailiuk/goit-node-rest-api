import HttpError from "../helpers/HttpError.js";
const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return next(HttpError(400, message));
    }
    next();
  };
  return func;
};

// const validateBody = (schema) => {
//   const func = (req, _, next) => {
//     const { error } = schema.validate(req.body);
//     if (error) {
//       next(HttpError(400, error.message));
//     }
//     next();
//   };

//   return func;
// };

export default validateBody;
