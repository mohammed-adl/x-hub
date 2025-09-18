import { MulterError } from "multer";
import { AppError } from "../utils/index.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  if (err instanceof MulterError) {
    let message = "Error uploading file";
    if (err.code === "LIMIT_FILE_SIZE")
      message = "File should be less than 5MB";
    if (err.code === "LIMIT_FILE_COUNT")
      message = "You can't upload more than 4 files";
    return res.status(400).json({ message });
  }

  if (
    ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
      err.name
    )
  )
    return res.status(401).json({ message: "Access Token invalid or expired" });

  const message = isProduction
    ? err instanceof AppError
      ? err.message
      : "Internal Server Error"
    : err.message;

  res.status(statusCode).json({ message });
};

export const notFound = (req, res, next) => {
  res.status(404).json({ message: "API endpoint not found" });
};
