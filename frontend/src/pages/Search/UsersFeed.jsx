import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";

import { Avatar, Spinner, ErrorMessage } from "../../components/ui";
import { handleSearchUsers } from "../../fetchers";
import styles from "./Search.module.css";

export default function UsersFeed() {
  const navigate = useNavigate();
  const { username: ownerUsername } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", query],
    queryFn: () => handleSearchUsers(query),
    refetchOnWindowFocus: false,
  });

  const users = data?.user || [];
  if (!users.length) return <div>No users found!</div>;

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;

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

      {ownerUsername === user.username ? (
        <button className={styles.followButton}>Follow</button>
      ) : null}
    </div>
  ));
}
