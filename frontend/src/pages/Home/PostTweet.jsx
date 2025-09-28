import styles from "./PostTweet.module.css";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import OptionsBox from "./OptionsBox";
import { Avatar } from "../../components/ui";
import { useUser } from "../../contexts";
import { delay } from "../../utils";
import { handlePostTweet } from "../../fetchers";

export default function PostTweet() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { profilePicture, name } = user;

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);

  function handleTyping(e) {
    setContent(e.target.value);
  }

  function handleFilesChange(newFiles) {
    const maxFiles = 4;
    let combined = [...selectedFiles, ...Array.from(newFiles)];
    combined = combined.slice(0, maxFiles);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles(combined);
    const urls = combined.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  }

  function clearPreviews() {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  }

  async function handlePost(e) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("tweetMedia", file);
        });
      }

      const body = await handlePostTweet(formData);
      const tweet = body.tweet;

      tweet.user.profilePicture = profilePicture;

      queryClient.setQueryData(["tweets"], (oldData) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page, index) => {
          if (index === 0) {
            return {
              ...page,
              tweets: [tweet, ...page.tweets],
            };
          }
          return page;
        });

        return { ...oldData, pages: newPages };
      });

      setContent("");
      setSelectedFiles([]);
      clearPreviews();
      setShowAnimation(true);
      await delay(500);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    } finally {
      setShowAnimation(false);
      setLoading(false);
    }
  }

  return (
    <div
      className={`${styles.postCard} ${
        showAnimation ? styles.shakeAnimation : ""
      }`}
    >
      <div className={styles.avatar}>
        <Avatar src={user.profilePicture} name={user.name} size={40} />
      </div>

      <div className={styles.postBox}>
        <div className={styles.previewContainer}>
          {previewUrls.map((url, idx) => (
            <div
              key={idx}
              className={styles.previewImageWrapper}
              style={{
                width: 80,
                height: 80,
                marginRight: idx !== previewUrls.length - 1 ? 8 : 0,
                borderRadius: 8,
                overflow: "hidden",
                display: "inline-block",
              }}
            >
              <img
                src={url}
                alt={`preview-${idx}`}
                className={styles.previewImage}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </div>
          ))}
        </div>
        <div className={styles.postContent}>
          <textarea
            name="tweet"
            className={styles.postText}
            value={content}
            onChange={handleTyping}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            rows={1}
            placeholder="What is happening?!"
          />
        </div>

        <div className={styles.postFooter}>
          <OptionsBox onFileSelect={handleFilesChange} />
          <button
            className={styles.postButton}
            onClick={handlePost}
            disabled={loading || content.trim().length === 0}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
