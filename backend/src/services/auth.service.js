import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/index.js";

import { io } from "../socket/index.js";
import {
  prisma,
  sendEmailPasscode,
  extractClientInfo,
  userSelect,
} from "../lib/index.js";

import { generatePasscode, generateUniqueUsername } from "../utils/index.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const isProd = process.env.NODE_ENV === "production";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_MAX_AGE,
} from "../config/constants.js";

const authService = {
  // ==============================================
  // USER CREATION
  // ==============================================
  async createUser(data) {
    const userExists = await prisma.xUser.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (userExists) {
      throw new AppError("User already exists", 400);
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const username = await generateUniqueUsername(data.name || "user");

    const user = await prisma.xUser.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        username,
        hasNotifications: true,
      },
      select: { ...userSelect },
    });

    await prisma.xNotification.create({
      data: {
        type: "WELCOME",
        fromUserId: process.env.X_ACCOUNT_ID,
        toUserId: user.id,
      },
    });

    return user;
  },
  // ==============================================
  // AUTHENTICATION
  // ==============================================
  async logIn(email, password) {
    const user = await prisma.xUser.findUnique({
      where: { email },
      select: { ...userSelect, password: true },
    });

    if (!user) {
      throw new AppError("Incorrect username or password", 400);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError("Incorrect username or password", 400);
    }
    delete user.password;
    return user;
  },

  async logOut(userId, refreshToken) {
    const tokens = await prisma.xRefreshToken.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokens.length) {
      throw new AppError("No refresh token found", 400);
    }

    let validToken = null;
    for (const token of tokens) {
      const isValid = await bcrypt.compare(refreshToken, token.token);
      if (isValid) {
        validToken = token;
        break;
      }
    }

    if (!validToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    await prisma.xRefreshToken.delete({
      where: { id: validToken.id },
    });
  },

  async logOutSession(userId, tokenId) {
    const session = await prisma.xRefreshToken.findFirst({
      where: { id: tokenId, expiresAt: { gt: new Date() } },
    });

    if (!session) throw new AppError("Session not found", 404);
    if (session.userId !== userId) throw new AppError("Unauthorized", 403);

    await prisma.xRefreshToken.delete({
      where: { id: tokenId },
    });
    if (session.socketId) {
      io.to(session.socketId).emit("logoutSession", tokenId);
    }

    const newSessions = await prisma.xRefreshToken.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      select: { id: true, device: true, ip: true, createdAt: true },
    });

    return newSessions;
  },

  async logOutAllSessions(userId) {
    await prisma.xRefreshToken.deleteMany({
      where: { userId },
    });
  },
  // ==============================================
  // PASSWORD RECOVERY
  // ==============================================
  async sendPasscode(email) {
    const user = await prisma.xUser.findUnique({ where: { email } });

    if (!user) {
      throw new AppError("Email not found", 404);
    }

    const passcode = generatePasscode();
    const select = isProd ? { email: true } : { email: true, passcode: true };

    const updatedUser = await prisma.xUser.update({
      where: { id: user.id },
      data: {
        passcode: passcode,
        passcodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      select,
    });

    await sendEmailPasscode({ email: updatedUser.email, passcode: passcode });
    return updatedUser;
  },

  async verifyPasscode(email, passcode) {
    const user = await prisma.xUser.findUnique({
      where: { email },
      select: { email: true, passcode: true, passcodeExpiresAt: true },
    });

    if (!user) {
      throw new AppError("Email not found", 404);
    }
    if (user.passcode !== passcode) {
      throw new AppError("Invalid passcode", 400);
    }
    if (!user.passcodeExpiresAt || user.passcodeExpiresAt < new Date()) {
      throw new AppError("Passcode expired", 400);
    }
  },

  async resetPassword(email, newPassword) {
    const user = await prisma.xUser.findUnique({ where: { email } });

    if (!user) {
      throw new AppError("Email not found", 404);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new AppError("You entered old password", 400);
    }

    await prisma.xUser.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passcode: null,
        passcodeExpiresAt: null,
      },
    });
  },

  // ==============================================
  // TOKEN HELPERS
  // ==============================================

  async saveRefreshToken(userId, refreshToken, req) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    const { ip, device } = extractClientInfo(req);

    const token = await prisma.xRefreshToken.create({
      data: {
        userId,
        token: hashedToken,
        ip,
        device,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
      },
      select: { id: true },
    });

    return token.id;
  },

  async verifyRefreshToken(token) {
    try {
      const payload = jwt.verify(token, REFRESH_SECRET);

      const storedToken = await prisma.xRefreshToken.findFirst({
        where: {
          userId: payload.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (!storedToken) {
        throw new AppError("Refresh token not found", 401);
      }

      const isValidToken = await bcrypt.compare(token, storedToken.token);
      if (!isValidToken) {
        throw new AppError("Invalid refresh token", 401);
      }

      return payload;
    } catch (err) {
      throw new AppError("Invalid refresh token", 401);
    }
  },

  generateAccessToken(payload) {
    return jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: `${ACCESS_TOKEN_EXPIRY}`,
    });
  },

  generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: `${REFRESH_TOKEN_EXPIRY}`,
    });
  },
};

export default authService;
