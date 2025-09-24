export const userSelect = {
  id: true,
  name: true,
  username: true,
  bio: true,
  profilePicture: true,
  coverImage: true,
  isVerified: true,
  isProtected: true,
  hasNotifications: true,
  createdAt: true,
  _count: {
    select: {
      tweets: true,
      following: true,
      followers: true,
    },
  },
};

export const retweetSelect = {
  id: true,
  content: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
      username: true,
    },
  },
  _count: {
    select: {
      likes: true,
      retweets: true,
      replies: true,
    },
  },
  tweetMedia: {
    select: {
      path: true,
      type: true,
    },
  },
};

export const tweetSelect = {
  id: true,
  content: true,
  parentTweetId: true,
  originalTweetId: true,
  createdAt: true,

  user: {
    select: {
      id: true,
      name: true,
      username: true,
      profilePicture: true,
      coverImage: true,
    },
  },

  tweetMedia: {
    select: {
      path: true,
      type: true,
    },
  },

  _count: {
    select: {
      likes: true,
      retweets: true,
      replies: true,
    },
  },
};

export const followerSelect = {
  id: true,
  follower: {
    select: {
      id: true,
      username: true,
      name: true,
      bio: true,
      profilePicture: true,
    },
  },
};

export const followingSelect = {
  id: true,
  following: {
    select: {
      id: true,
      username: true,
      name: true,
      bio: true,
      profilePicture: true,
    },
  },
};

export const replySelect = {
  id: true,
  content: true,
  createdAt: true,
  parentId: true,
  tweet: {
    select: {
      id: true,
      authorId: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      username: true,
    },
  },
};

export const notificationSelect = {
  id: true,
  type: true,
  createdAt: true,
  isViewed: true,
  fromUser: {
    select: {
      id: true,
      name: true,
      username: true,
    },
  },
  toUser: {
    select: {
      id: true,
      name: true,
      username: true,
    },
  },
  tweet: {
    select: {
      id: true,
      authorId: true,
      content: true,
      _count: {
        select: {
          retweets: true,
          likes: true,
          replies: true,
        },
      },
    },
  },
};

export const sessionSelect = {
  id: true,
  device: true,
  ip: true,
  createdAt: true,
  token: true,
};

export const messageSelect = {
  id: true,
  content: true,
  isRead: true,
  createdAt: true,
  sender: {
    select: {
      id: true,
      name: true,
      username: true,
      profilePicture: true,
    },
  },
  receiver: {
    select: {
      id: true,
      name: true,
      username: true,
      profilePicture: true,
    },
  },
};
