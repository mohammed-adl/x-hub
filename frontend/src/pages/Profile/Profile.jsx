import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import UserPage from "./UserPage.jsx";
import { Spinner, ErrorMessage } from "../../components/ui";

import { generateAvatar, formatJoinedDate } from "../../utils";
import { handleGetUser } from "../../fetchers/user.js";

export default function Profile() {
  const { username } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      try {
        return await handleGetUser(username);
      } catch (err) {
        throw err;
      }
    },
  });

  const user = data?.user || {};
  const isFollowing = data?.isFollowing;

  const { name, bio, profilePicture, coverImage } = user;
  const avatarUrl = profilePicture || generateAvatar(name);
  const postsCount = user?._count?.tweets;
  const joinDate = formatJoinedDate(user.createdAt);
  const followingCount = user?._count?.following;
  const followersCount = user?._count?.followers;
  const followingPath = `/${username}/following`;
  const followersPath = `/${username}/followers`;

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;

  return (
    <UserPage
      name={name}
      bio={bio}
      username={username}
      profilePicture={profilePicture}
      coverImage={coverImage}
      followingPath={followingPath}
      followersPath={followersPath}
      isFollowingUser={isFollowing}
      postsCount={postsCount}
      joinDate={joinDate}
      followersCount={followingCount}
      followingCount={followersCount}
      avatarUrl={avatarUrl}
    />
  );
}
