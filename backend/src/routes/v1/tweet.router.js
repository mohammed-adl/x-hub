import express from "express";
const router = express.Router();

import { verifyToken, validate } from "../../middlewares/index.js";
import { tweetParams, tweetPost } from "../../schemas/index.js";
import { upload } from "../../middlewares/index.js";
import * as tweetController from "../../controllers/tweet/index.js";

router.use(verifyToken);

router.get("/", tweetController.getTimeLine);

router.get("/:id", validate({ params: tweetParams }), tweetController.getTweet);

router.get(
  "/:id/replies",
  validate({ params: tweetParams }),
  tweetController.getReplies
);

router.post(
  "/",
  upload.array("tweetMedia", 4),
  validate({ body: tweetPost }),
  tweetController.postTweet
);

router.post(
  "/:id/like",
  validate({ params: tweetParams }),
  tweetController.toggleLike
);

router.post(
  "/:id/retweet",
  validate({ params: tweetParams }),
  tweetController.toggleRetweet
);

router.post(
  "/:id/reply",
  validate({ body: tweetPost }),
  tweetController.replytoTweet
);

router.delete(
  "/:id",
  validate({ params: tweetParams }),
  tweetController.deleteTweet
);

export default router;
