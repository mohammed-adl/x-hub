export function mapTweetToProps(tweet) {
  const retweet = tweet.retweet || null;

  return {
    tweetId: retweet ? retweet.id : tweet.id,
    name: retweet ? retweet.user.name : tweet.user.name,
    username: retweet ? retweet.user.username : tweet.user.username,
    profilePicture: retweet
      ? retweet.user.profilePicture
      : tweet.user.profilePicture,
    content: retweet ? retweet.content : tweet.content,
    date: retweet ? retweet.createdAt : tweet.createdAt,
    likesCount: retweet ? retweet._count.likes : tweet._count.likes,
    repliesCount: retweet ? retweet._count.replies : tweet._count.replies,
    retweetsCount: retweet ? retweet._count.retweets : tweet._count.retweets,
    originalTweetId: retweet ? retweet.originalTweetId : tweet.originalTweetId,
    originalTweet: retweet ? retweet.originalTweet : null,

    parentTweetId: retweet ? retweet.parentTweetId : tweet.parentTweetId,
    userId: retweet ? retweet.user.id : tweet.user.id,
    isLiked: tweet.isLiked,
    isRetweeted: tweet.isRetweeted,
    tweetMedia: retweet ? retweet.tweetMedia : tweet.tweetMedia,
  };
}
