import jwt from "jsonwebtoken";
import { prisma } from "../lib/index.js";
import { AppError } from "../utils/index.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Access token not found", 401);
  }

  const accessToken = authHeader.split(" ")[1];
  const payload = jwt.verify(accessToken, process.env.ACCESS_SECRET);

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });
  if (!user) throw new AppError("User not found", 401);

  req.user = payload;

  next();
};

export function validateBodyToken(token) {
  const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
  return decoded.id;
}
