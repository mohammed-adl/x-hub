import { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { BackButton } from "../../components/ui";
import { message } from "../../assets/icons";

import TweetsFeed from "./TweetsFeed.jsx";

import { useUser } from "../../contexts";
import { handleToggleFollow } from "../../fetchers";
import styles from "./Profile.module.css";

export default function UserPage({
  name,
  bio,
  username,
  coverImage,
  followingPath,
  followersPath,
  postsCount,
  joinDate,
  followersCount,
  followingCount,
  avatarUrl,
  isFollowingUser,
}) {
  const { user } = useUser();
  const { username: ownerUsername } = user || {};
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { username: targetUsername } = useParams();
  const [showImage, setShowImage] = useState(false);

  async function followUser() {
    try {
      await handleToggleFollow(username);
      await queryClient.invalidateQueries(["user", username]);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.profile}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <BackButton />
          <div className={styles.metaData}>
            <h2 className={styles.profileName}>{name}</h2>
            <div className={styles.postsCount}>{postsCount} posts</div>
          </div>
        </div>

        <div className={styles.coverImage}>
          {coverImage ? (
            <img src={coverImage} alt="cover image" />
          ) : (
            <div className={styles.coverPlaceholder} />
          )}
        </div>

        <div className={styles.profileDetails}>
          <div className={styles.editProfileBox}>
            <div
              className={styles.profilePicture}
              onClick={() => setShowImage(true)}
              style={{ cursor: "pointer" }}
            >
              <img src={avatarUrl} alt="profile picture" />
            </div>
            {username === ownerUsername ? (
              <button
                className={styles.editProfileButton}
                onClick={() => navigate(`/profile/edit`)}
              >
                Edit Profile
              </button>
            ) : (
              <div className={styles.followButtonWrapper}>
                <img
                  src={message}
                  alt="message icon"
                  className={styles.messageIcon}
                  onClick={() => navigate("/messages", { state: { username } })}
                />
                <button
                  className={styles.editProfileButton}
                  onClick={followUser}
                >
                  {isFollowingUser ? "Unfollow" : "Follow"}
                </button>
              </div>
            )}
          </div>

          <h3 className={styles.profileName}>{name}</h3>
          <span>@{username}</span>
          <p className={styles.bio}>{bio}</p>
          <div className={styles.joiningDate}>📅 Joined {joinDate}</div>

          <div className={styles.followBox}>
            <Link className={styles.followType} to={followersPath}>
              <span className={styles.followCount}>{followersCount}</span>{" "}
              followers
            </Link>

            <Link className={styles.followType} to={followingPath}>
              <span className={styles.followCount}>{followingCount}</span>{" "}
              following
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.timeline}>
        <div className={styles.timelineNav}>
          <ul className={styles.navList}>
            <Link to={`/${username}`}>
              <li className={styles.navItem}>Tweets</li>
            </Link>
          </ul>
        </div>
        <div className={styles.timelineFeed}>
          <TweetsFeed username={username} />
        </div>
      </div>

      {showImage && (
        <div
          className={styles.imageModalOverlay}
          onClick={() => setShowImage(false)}
        >
          <div
            className={styles.imageModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={avatarUrl} alt="profile full view" />
            <button
              className={styles.closeButton}
              onClick={() => setShowImage(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
