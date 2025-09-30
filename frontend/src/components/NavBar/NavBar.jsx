import { useState } from "react";
import { Link } from "react-router-dom";

import { handleMarkAsVisited } from "../../fetchers/index.js";
import { useUser, useNotification, useMessage } from "../../contexts/index.js";

import UserDropdown from "./UserDropDown.jsx";
import LinkBox from "./LinkBox.jsx";
import { Avatar } from "../ui/index.js";
import XLogo from "../../assets/XLogo.svg";
import { home, bell, profile, message } from "../../assets/icons/index.js";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const { hasNotifications, setHasNotifications } = useNotification();
  const { hasUnreadMessages, setHasUnreadMessages } = useMessage();
  const { user, setUser } = useUser();
  if (!user) return null;
  const { name, username } = user;
  const [open, setopen] = useState(false);

  function handleClick() {
    setopen((prev) => !prev);
  }

  async function visitNotifications() {
    try {
      const body = await handleMarkAsVisited();
      setUser(body.user);
      setHasNotifications(false);
    } catch (err) {
      console.error("Error visiting notifications:", err);
    }
  }

  return (
    <div className={styles.sideBarContainer}>
      <div className={styles.logoBox}>
        <Link to="/home">
          <img src={XLogo} alt="X Logo" className={styles.logo} />
        </Link>
      </div>

      <ul className={styles.linksContainer}>
        <LinkBox value="Home" src={home} navLink="/home" />
        <LinkBox value="Profile" src={profile} navLink={`/${username}`} />
        <LinkBox value="Messages" src={message} navLink="/messages" />
        <LinkBox
          value="Notifications"
          src={bell}
          navLink="/notifications"
          hasNotification={hasNotifications}
          onClick={visitNotifications}
        />

        <li className={styles.mobileAvatarItem}>
          <div onClick={handleClick} className={styles.mobileAvatarClick}>
            <Avatar src={user.profilePicture} name={user.name} size={30} />
          </div>
        </li>
      </ul>

      <div className={styles.userCard}>
        <Link onClick={handleClick}>
          <div className={styles.userBox}>
            <Avatar src={user.profilePicture} name={user.name} size={50} />
            <div className={styles.userInfo}>
              <div className={styles.fullName}>{name}</div>
              <div className={styles.userName}>@{username}</div>
            </div>
          </div>
        </Link>
      </div>

      {open && <UserDropdown />}
    </div>
  );
}
