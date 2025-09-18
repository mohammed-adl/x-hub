import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { handleLogOut } from "../../fetchers";
import authService from "../../services/authService";
import styles from "./NavBar.module.css";

export default function UserDropdown() {
  const [open, setOpen] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function logoutUser() {
    try {
      await handleLogOut();
      authService.logout();
    } catch (err) {
      if (err.status === 401) logout();
    }
  }

  if (!open) return null;

  return (
    <div ref={dropdownRef} className={styles.dropDown}>
      <button className={styles.dropDownButton} onClick={logoutUser}>
        Log out
      </button>
      <button
        className={styles.dropDownButton}
        onClick={() => navigate("devices")}
      >
        Devices Logs
      </button>
    </div>
  );
}
