import { createContext, useContext, useEffect, useState } from "react";

import { useUser } from "./UserContext.jsx";
import { socket } from "../socket";
import { showNotificationToast } from "../toasts/notificationToast.jsx";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user, setUser } = useUser();
  const [hasNotifications, setHasNotifications] = useState(
    user?.hasNotifications
  );

  useEffect(() => {
    if (!socket.on) return;

    const handleNewNotification = (data) => {
      setUser((prev) => ({ ...prev, hasNotifications: true }));
      setHasNotifications(true);

      if (window.innerWidth >= 1024) {
        showNotificationToast(data);
      }
    };

    socket.on("newNotification", handleNewNotification);

    return () => socket.off("newNotification", handleNewNotification);
  }, []);

  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === "user" && event.newValue) {
        const user = JSON.parse(event.newValue);
        if (user.hasNotifications === false) {
          setUser({ ...user, hasNotifications: false });
          setHasNotifications(false);
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setUser]);

  return (
    <NotificationContext.Provider
      value={{ hasNotifications, setHasNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
