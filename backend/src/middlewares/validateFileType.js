import fs from "fs/promises";
import { fileTypeFromFile } from "file-type";
import { AppError } from "../utils/index.js";

export const validateFileType = (accept = "image") => {
  return async (req, res, next) => {
    try {
      const filesToCheck = [];

      if (req.file) {
        filesToCheck.push(req.file);
      } else if (Array.isArray(req.files)) {
        filesToCheck.push(...req.files);
      } else if (typeof req.files === "object" && req.files !== null) {
        for (const key in req.files) {
          filesToCheck.push(...req.files[key]);
        }
      }

      if (filesToCheck.length === 0) return next();

      for (const file of filesToCheck) {
        const type = await fileTypeFromFile(file.path);

        const isValid =
          type &&
          (typeof accept === "string"
            ? type.mime.startsWith(`${accept}/`)
            : Array.isArray(accept) && accept.includes(type.mime));

        if (!isValid) {
          await fs.unlink(file.path);
          return next(new AppError("Invalid file type", 400));
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
