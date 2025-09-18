import { useState } from "react";

function FollowButton({
  user,
  isFollowing = false,
  onFollow,
  style = {},
  disabled = false,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    backgroundColor: disabled ? "#8b98a5" : isHovered ? "#1a8cd8" : "#1d9bf0",
    color: "#fff",
    border: "none",
    borderRadius: "9999px",
    padding: "6px 16px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background-color 0.15s ease-in-out",
    flexShrink: 0,
    ...style,
  };

  return (
    <button
      style={baseStyle}
      onClick={() => onFollow(user.username)}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export default FollowButton;
