import asyncHandler from "express-async-handler";
import { success } from "../../lib/index.js";
import { authService } from "../../services/index.js";

export const sendPasscode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await authService.sendPasscode(email);

  res.status(200);
  success(res, {
    user,
  });
});

export const verifyPasscode = asyncHandler(async (req, res) => {
  const { email, passcode } = req.body;

  await authService.verifyPasscode(email, passcode);

  res.status(200);
  success(res, {
    user: {},
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  await authService.resetPassword(email, newPassword);

  res.status(200);
  success(res, null);
});
