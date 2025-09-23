import asyncHandler from "express-async-handler";
import { success } from "../../lib/index.js";
import { authService } from "../../services/index.js";
import { attachFullUrls } from "../../utils/index.js";

const isProd = process.env.NODE_ENV === "production";

export const signUp = asyncHandler(async (req, res) => {
  const { ...formData } = req.body;

  const user = await authService.createUser(formData);

  const accessToken = authService.generateAccessToken({
    id: user.id,
  });

  const refreshToken = authService.generateRefreshToken({
    id: user.id,
  });

  await authService.saveRefreshToken(user.id, refreshToken, req);

  const userWithUrls = attachFullUrls(user);

  success(
    res,
    {
      message: "User registered successfully",
      token: accessToken,
      refreshToken,
      user: userWithUrls,
    },
    201
  );
});
