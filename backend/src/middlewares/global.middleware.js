import cors from "cors";
import helmet from "helmet";
import express from "express";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { RATE_LIMIT } from "../config/constants.js";

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many login attempts, please try again later.",
  },
});

export const registerMiddlewares = (app) => {
  app.use(helmet());

  const allowedOrigins = [`${process.env.ORIGIN}`, "http://localhost:5173"];
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );

  app.use("/uploads", express.static("uploads"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cookieParser());

  app.use(generalLimiter);

  app.use(morgan("dev"));
};
