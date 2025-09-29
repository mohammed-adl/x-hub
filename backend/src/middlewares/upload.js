import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { generateFlakeId } from "../utils/index.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const folderMap = {
  profilePicture: "profilePictures",
  coverImage: "coverImages",
  tweetMedia: "tweetMedia",
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const subfolder = folderMap[file.fieldname] || "other";
    const ext = file.originalname.split(".").pop();
    const uniqueName = `${generateFlakeId()}`;

    file.relativePath = `${subfolder}/${uniqueName}`;

    return {
      folder: subfolder,
      public_id: uniqueName,
      format: ext,
      resource_type: "image",
    };
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
  limits: { fileSize: 5 * 1024 * 1024 },
});
