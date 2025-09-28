import asyncHandler from "express-async-handler";
import { prisma, tweetSelect, success } from "../../lib/index.js";
import { generateFlakeId, getFileUrlFromMulter } from "../../utils/index.js";

export const postTweet = asyncHandler(async (req, res) => {
  const { content, parentTweetId, originalTweetId } = req.body;
  const images = req.files || [];

  const tweet = await prisma.xTweet.create({
    data: {
      id: generateFlakeId(),
      content: content || null,
      authorId: req.user.id,
      parentTweetId: parentTweetId || null,
      originalTweetId: originalTweetId || null,
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
    select: {
      ...tweetSelect,
      originalTweet: originalTweetId ? { select: tweetSelect } : false,
    },
  });

  const tweetWithUrls = {
    ...tweet,
    tweetMedia:
      tweet.tweetMedia?.map((media) => ({
        ...media,
        path: getFileUrlFromMulter(media.path),
      })) || [],
    originalTweet: tweet.originalTweet
      ? {
          ...tweet.originalTweet,
          tweetMedia:
            tweet.originalTweet.tweetMedia?.map((media) => ({
              ...media,
              path: getFileUrlFromMulter(media.path),
            })) || [],
        }
      : null,
  };

  success(res, { tweet: tweetWithUrls }, 201);
});
