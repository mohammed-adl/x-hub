export const getFileUrl = (filePath) => {
  if (!filePath) return null;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${filePath}`;
};

export const getFileUrlFromMulter = (file) => {
  // Cloudinary already provides the full URL
  return file.path; // Cloudinary stores full URL in file.path
};

export function attachFullUrls(input) {
  const mapUser = (user) => ({
    ...user,
    profilePicture: user.profilePicture
      ? getFileUrl(user.profilePicture)
      : null,
    coverImage: user.coverImage ? getFileUrl(user.coverImage) : null,
  });

  const mapTweet = (tweet) => ({
    ...tweet,
    user: tweet.user ? mapUser(tweet.user) : null,
    tweetMedia:
      tweet.tweetMedia?.map((media) => ({
        ...media,
        path: getFileUrl(media.path),
      })) || [],
  });

  if (Array.isArray(input)) {
    if (
      input.length > 0 &&
      (input[0].tweetMedia !== undefined || input[0].user)
    ) {
      return input.map(mapTweet);
    } else {
      return input.map(mapUser);
    }
  } else if (input.user || input.tweetMedia) {
    return mapTweet(input);
  } else {
    return mapUser(input);
  }
}

export function attachChatUrls(messages) {
  return messages.map((msg) => ({
    ...msg,
    sender: msg.sender
      ? {
          ...msg.sender,
          profilePicture: msg.sender.profilePicture
            ? getFileUrl(msg.sender.profilePicture)
            : null,
        }
      : null,
    receiver: msg.receiver
      ? {
          ...msg.receiver,
          profilePicture: msg.receiver.profilePicture
            ? getFileUrl(msg.receiver.profilePicture)
            : null,
        }
      : null,
  }));
}
