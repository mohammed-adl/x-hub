import { useState } from "react";
import { Link } from "react-router-dom";

import { Spinner, ErrorMessage, Avatar } from "../ui";
import { handleToggleFollow } from "../../fetchers";
import styles from "./ExploreBar.module.css";

export default function FollowSuggestions({
  suggestions = [],
  isLoading,
  error,
}) {
  const [followed, setFollowed] = useState(new Set());

  async function follow(username) {
    try {
      await handleToggleFollow(username);
      setFollowed((prev) => new Set(prev).add(username));
    } catch (err) {
      console.log(err);
    }
  }

  async function unFollow(username) {
    try {
      await handleToggleFollow(username);
    } catch (err) {
      console.log(err);
    }
    setFollowed((prev) => {
      const next = new Set(prev);
      next.delete(username);
      return next;
    });
  }

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;

  return (
    <aside className={styles.followingCard}>
      <h2 className={styles.followingBoxTitle}>You might like</h2>

      <ul className={styles.cardsContainer}>
        {suggestions.map((user) => {
          return (
            <li className={styles.userCard} key={user.id}>
              <Link to={`/${user.username}`}>
                <Avatar src={user.profilePicture} name={user.name} size={40} />
              </Link>
              <div className={styles.userInfo}>
                <Link to={`/${user.username}`} className={styles.fullName}>
                  {user.name}
                </Link>
                <Link to={`/${user.username}`} className={styles.userName}>
                  @{user.username}
                </Link>
              </div>
              {followed.has(user.username) ? (
                <button
                  className={styles.followButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    unFollow(user.username);
                  }}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className={styles.followButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    follow(user.username);
                  }}
                >
                  Follow
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
