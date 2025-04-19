import express from "express";

import authControllers from "../controllers/authControllers.js";
import * as authSchemas from "../schemas/authSchemas.js";
import validateBody from "../helpers/validateBody.js";
import upload from "../middlewares/upload.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.single("avatarURL"),
  validateBody(authSchemas.signupSchema),
  authControllers.signupController
);

authRouter.post(
  "/login",
  upload.single("email"),
  validateBody(authSchemas.signinSchema),
  authControllers.signinController
);

authRouter.get("/current", authenticate, authControllers.getCurrentController);

authRouter.post("/logout", authenticate, authControllers.logoutController);

authRouter.patch(
  "/subscription",
  authenticate,
  validateBody(authSchemas.updateSubscriptionSchema),
  authControllers.updateSubscriptionController
);

authRouter.patch(
  "/avatars",
  authenticate,
  validateBody(authSchemas.updateAvatarSchema),
  upload.single("avatarURL"),
  authControllers.updateAvatarController
);

export default authRouter;
