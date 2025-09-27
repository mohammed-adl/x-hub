import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useUser } from "../../contexts";
import { Avatar, Spinner, ErrorMessage } from "../../components/ui";
import { handleSearchUsers, handleToggleFollow } from "../../fetchers";
import styles from "./Search.module.css";

export default function UsersFeed() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { username: ownerUsername } = user;
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", query],
    queryFn: () => handleSearchUsers(query),
    refetchOnWindowFocus: false,
  });

  const toggleFollow = useMutation({
    mutationFn: (username) => handleToggleFollow(username),
    onSuccess: (data, username) => {
      queryClient.setQueryData(["users", query], (old) => {
        if (!old) return old;
        return {
          ...old,
          user: old.user.map((u) =>
            u.username === username
              ? { ...u, isFollowing: data.isFollowing }
              : u
          ),
        };
      });
    },
  });

  const users = data?.user || [];
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;
  if (!users.length) return <div>No users found!</div>;

  return users.map((user) => (
    <div className={styles.userCard} key={user.id}>
      <Avatar
        src={user.profilePicture}
        name={user.name}
        size={42}
        onClick={() => navigate(`/${user.username}`)}
      />
      <div className={styles.userInfo}>
        <div
          className={styles.fullName}
          onClick={() => navigate(`/${user.username}`)}
        >
          {user.name}
        </div>
        <div className={styles.userName}>@{user.username}</div>
      </div>
      {ownerUsername !== user.username ? (
        <button
          className={styles.followButton}
          onClick={() => toggleFollow.mutate(user.username)}
        >
          {user.isFollowing ? "Unfollow" : "Follow"}
        </button>
      ) : null}
    </div>
  ));
}
