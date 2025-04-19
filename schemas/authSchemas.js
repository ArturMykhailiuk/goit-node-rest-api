import Joi from "joi";

import { emailRegexp, subscriptionTypes } from "../constants/auth.js";

export const signupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid(...subscriptionTypes),
  avatarURL: Joi.string().uri(),
});

export const signinSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionTypes)
    .required(),
});

export const updateAvatarSchema = Joi.object({
  avatarURL: Joi.string().uri().required(),
});
