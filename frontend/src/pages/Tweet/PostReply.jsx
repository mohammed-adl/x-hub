import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import Avatar from "../../components/ui/Avatar.jsx";

import { useUser } from "../../contexts";
import { handlePostReply } from "../../fetchers";
import styles from "./Tweet.module.css";

export default function PostReply({ tweetId }) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { profilePicture, name } = user;

  const avatarUrl = profilePicture || generateAvatar(name);

  function handleChange(e) {
    const { value } = e.target;
    setContent(value);
  }

  async function postReply(tweetId) {
    setLoading(true);
    try {
      const body = { content };
      await handlePostReply(body, tweetId);
      queryClient.invalidateQueries(["replies", tweetId]);
      setContent("");
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.postReplyBox}>
      <div className={styles.avatarBox}>
        <Avatar src={avatarUrl} alt={profilePicture} size={40} />
      </div>
      <textarea
        className={styles.postReplyText}
        value={content}
        onChange={handleChange}
        // Make text lines wrap
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        rows={1}
        placeholder="Post your reply"
      />
      <button
        className={styles.postReplyButton}
        onClick={() => postReply(tweetId)}
        disabled={loading}
      >
        {loading ? <div className="spinner" /> : "Reply"}
      </button>
    </div>
  );
}
