import toast from "react-hot-toast";
import { generateAvatar } from "../utils/index.js";

export function showNotificationToast(data) {
  const type = data?.type;
  let message;
  const sender = data?.fromUser?.name;

  switch (type) {
    case "LIKE":
      message = ` liked your tweet`;
      break;
    case "REPLY":
      message = ` replied to your tweet`;
      break;
    case "RETWEET":
      message = ` retweeted your tweet`;
      break;
    case "FOLLOW":
      message = ` followed you`;
      break;
    default:
      return;
  }

  const avatarUrl =
    data?.fromUser?.profilePicture || generateAvatar(data.fromUser.name);

  const tweetPath = `/tweet/${data?.tweet.id}`;
  const userPath = `/${data?.fromUser.username}`;
  const path = data?.tweet?.id ? tweetPath : userPath;

  toast.custom(
    (t) => (
      <div
        onClick={() => {
          window.location.href = path;
          toast.dismiss(t.id);
        }}
        style={{
          backgroundColor: "#ffffff",
          fontSize: "1.1rem",
          borderRadius: "0.6rem",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          minWidth: "20rem",
          maxWidth: "25rem",
          padding: "1rem 1.25rem",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src={avatarUrl || "/placeholder.svg"}
          alt="avatar"
          style={{
            width: "2.8rem",
            height: "2.8rem",
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: "1rem",
            border: "0.1rem solid #333",
            boxShadow: "0 0.25rem 0.9rem rgba(0, 0, 0, 0.2)",
          }}
        />
        <span style={{ color: "#1f2937" }}>
          <strong>{sender}</strong>
          {message}
        </span>
      </div>
    ),
    { duration: 6000 }
  );
}
