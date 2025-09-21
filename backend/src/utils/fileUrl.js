export const getFileUrl = (filePath) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return `${baseUrl}/uploads/${filePath}`;
};

export const getFileUrlFromMulter = (file) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return `${baseUrl}/uploads/${file.relativePath}`;
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
    return input.map(mapTweet);
  } else if (input.user || input.tweetMedia) {
    // Single tweet object
    return mapTweet(input);
  } else {
    // Single user object
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
