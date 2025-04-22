import express from "express";

import authControllers from "../controllers/authControllers.js";
import authSchemas from "../schemas/authSchemas.js";
import validateBody from "../middlewares/validateBody.js";
import validateAvatar from "../middlewares/validateAvatar.js";
import upload from "../middlewares/upload.js";
import authenticate from "../middlewares/authenticate.js";
import isVerified from "../middlewares/isVerified.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.single("avatarURL"),
  validateBody(authSchemas.registerSchema),
  authControllers.registerController
);

authRouter.post(
  "/login",
  isVerified,
  upload.single("email"),
  validateBody(authSchemas.loginSchema),
  authControllers.loginController
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
  upload.single("avatarURL"),
  validateAvatar,
  authControllers.updateAvatarController
);

authRouter.get(
  "/verify/:verificationToken?",
  authControllers.getConfirmationForVerificationLetterController
);

authRouter.post(
  "/verify",
  validateBody(authSchemas.validationEmailSchema),
  authControllers.additionalReqForVerificationLetterController
);

export default authRouter;
