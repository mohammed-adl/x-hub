import { generateAvatar } from "../../utils";

const Avatar = ({ src, name = "Unknown", size = 52, onClick }) => {
  const avatarUrl = src || generateAvatar(name);

  return (
    <img
      src={avatarUrl}
      alt={name}
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "cover",
        borderRadius: "50%",
        flexShrink: 0,
        cursor: "pointer",
      }}
    />
  );
};

export default Avatar;
