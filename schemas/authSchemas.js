import Joi from "joi";

import { emailRegexp, subscriptionTypes } from "../constants/auth.js";

const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid(...subscriptionTypes),
  avatarURL: Joi.string().uri(),
});

const loginSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionTypes)
    .required(),
});

const validationEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export default {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
  validationEmailSchema,
};
