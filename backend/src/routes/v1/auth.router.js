import express from "express";
const router = express.Router();

import { verifyToken, validate } from "../../middlewares/index.js";
import {
  signUp,
  logIn,
  sendPasscode,
  verifyPasscode,
  resetPassword,
  session,
} from "../../schemas/index.js";
import { authLimiter } from "../../middlewares/index.js";
import * as authController from "../../controllers/auth/index.js";

router.post("/refresh-token", authController.refreshToken);

router.delete("/logout", verifyToken, authController.logOut);
router.delete(
  "/:id/logout",
  verifyToken,
  validate({ params: session }),
  authController.logOutSession
);
router.delete("/logout-all", verifyToken, authController.logOutAllSessions);

router.use(authLimiter);

router.post("/signup", validate({ body: signUp }), authController.signUp);
router.post("/login", validate({ body: logIn }), authController.logIn);

router.post(
  "/reset-password",
  validate({ body: sendPasscode }),
  authController.sendPasscode
);
router.post(
  "/reset-password/verify",
  validate({ body: verifyPasscode }),
  authController.verifyPasscode
);
router.post(
  "/reset-password/reset",
  validate({ body: resetPassword }),
  authController.resetPassword
);

export default router;
