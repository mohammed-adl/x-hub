import asyncHandler from "express-async-handler";
import { prisma, tweetSelect, success } from "../../lib/index.js";
import { generateFlakeId, getFileUrlFromMulter } from "../../utils/index.js";

export const postTweet = asyncHandler(async (req, res) => {
  const content = req.body.content;
  const parentTweetId = req.body.parentTweetId || null;
  const images = req.files || [];

  const tweet = await prisma.xTweet.create({
    data: {
      id: generateFlakeId(),
      content,
      authorId: req.user.id,
      parentTweetId,
      tweetMedia: {
        create:
          images.length > 0
            ? images.map((image) => ({
                path: image.relativePath,
                type: "IMAGE",
              }))
            : [],
      },
    },
    select: tweetSelect,
  });

  const tweetWithUrls = {
    ...tweet,
    tweetMedia:
      tweet.tweetMedia?.map((media) => ({
        ...media,
        path: getFileUrlFromMulter(media.path),
      })) || [],
  };

  success(res, { tweet: tweetWithUrls }, 201);
});
