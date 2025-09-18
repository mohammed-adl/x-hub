import multer from "multer";
import fs from "fs";
import path from "path";
import { generateFlakeId } from '../utils/index.js';

const baseUploadDir = "uploads";

const ensureFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const folderMap = {
  profilePicture: "profilePictures",
  coverImage: "coverImages",
  tweetMedia: "tweetMedia",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const field = file.fieldname;
    const subfolder = folderMap[field] || "other";
    const fullPath = path.join(baseUploadDir, subfolder);

    ensureFolder(fullPath);
    cb(null, fullPath);
  },

  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const uniqueName = `${generateFlakeId()}.${ext}`;

    // Store the relative path in a custom property for easy access
    const subfolder = folderMap[file.fieldname] || "other";
    file.relativePath = `${subfolder}/${uniqueName}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
