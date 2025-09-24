import express from "express";
const router = express.Router();
import { upload } from "../../middlewares/index.js";

import {
  verifyToken,
  validate,
  validateFileType,
} from "../../middlewares/index.js";
import { userId, username, editProfile } from "../../schemas/index.js";
import * as userController from "../../controllers/user/index.js";
import * as tweetController from "../../controllers/tweet/index.js";

router.use(verifyToken);

router.get("/:id/sessions", userController.getSessionsLogs);
router.get("/suggestions", verifyToken, userController.getSuggestions);

router.get(
  "/:username",
  validate({ params: username }),
  userController.getUser
);

router.put(
  "/",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validate({ body: editProfile }),
  validateFileType(["image/jpeg", "image/png"]),
  userController.editProfile
);

router.get(
  "/:username/followers",
  validate({ params: username }),
  userController.getFollowers
);

router.post(
  "/:username/follow",
  validate({ params: username }),
  userController.toggleFollow
);

router.get(
  "/:username/following",
  validate({ params: username }),
  userController.getFollowing
);

router.get(
  "/:username/tweets",
  validate({ params: username }),
  tweetController.getTweets
);

export default router;
