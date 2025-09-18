import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { Avatar } from "../ui";
import { handleToggleFollow } from "../../fetchers";
import styles from "./FollowCard.module.css";

function FollowCard({ user }) {
  const navigate = useNavigate();
  const { username: ownerUsername } = useParams();
  const queryClient = useQueryClient();

  const { name, username, bio, profilePicture, isFollowing } = user;

  async function followUser() {
    try {
      await handleToggleFollow(username);

      queryClient.setQueryData(["following", ownerUsername], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            following: page.following.map((u) =>
              u.username === username
                ? { ...u, isFollowing: !u.isFollowing }
                : u
            ),
          })),
        };
      });

      queryClient.setQueryData(["followers", ownerUsername], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            followers: page.followers.map((u) =>
              u.username === username
                ? { ...u, isFollowing: !u.isFollowing }
                : u
            ),
          })),
        };
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <li className={styles.followCard}>
      <Avatar
        src={user.profilePicture}
        name={user.name}
        size={40}
        onClick={() => navigate(`/${user.username}`)}
      />

      <div className={styles.followInfo}>
        <p
          className={styles.followFullName}
          onClick={() => navigate(`/${username}`)}
        >
          {name}
        </p>
        <p className={styles.followUserName}>@{username}</p>
        <p className={styles.followBio}>{bio}</p>
      </div>
      <button className={styles.followButton} onClick={followUser}>
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </li>
  );
}

export default FollowCard;
