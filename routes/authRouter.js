import express from "express";

import authenticate from "../middlewares/authenticate.js";

import authControllers from "../controllers/authControllers.js";

import validateBody from "../helpers/validateBody.js";

import {
  authSignupSchema,
  authSigninSchema,
  updateSubscriptionSchema,
} from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(authSignupSchema),
  authControllers.signupController
);

authRouter.post(
  "/login",
  validateBody(authSigninSchema),
  authControllers.signinController
);

authRouter.get("/current", authenticate, authControllers.getCurrentController);

authRouter.post("/logout", authenticate, authControllers.logoutController);

authRouter.patch(
  "/subscription",
  authenticate,
  validateBody(updateSubscriptionSchema),
  authControllers.updateSubscription
);

export default authRouter;
