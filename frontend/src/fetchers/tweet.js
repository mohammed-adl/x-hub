import { reqApi } from "../lib/index.js";

export async function handleGetTimeLine({ limit, cursor }) {
  return await reqApi(`/tweets?limit=${limit}&cursor=${cursor}`);
}

export async function handleGetTweet(tweetId) {
  return await reqApi(`/tweets/${tweetId}`);
}

export async function handleGetReplies({ limit, cursor, tweetId }) {
  return await reqApi(
    `/tweets/${tweetId}/replies?limit=${limit}&cursor=${cursor}`
  );
}

export async function handlePostTweet(formData) {
  return await reqApi(`/tweets`, {
    method: "POST",
    body: formData,
  });
}

export async function handlePostReply(body, tweetId) {
  return await reqApi(`/tweets/${tweetId}/reply`, {
    method: "POST",
    body,
  });
}

export async function handleRetweet(tweetId) {
  return await reqApi(`/tweets/${tweetId}/retweet`, {
    method: "POST",
  });
}

export async function handleLikeTweet(tweetId) {
  return await reqApi(`/tweets/${tweetId}/like`, {
    method: "POST",
  });
}

export async function handleDeleteTweet(tweetId) {
  return await reqApi(`/tweets/${tweetId}`, {
    method: "DELETE",
  });
}
