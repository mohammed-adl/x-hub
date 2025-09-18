import { createContext, useContext, useEffect, useState } from "react";

import { useUser } from "./UserContext.jsx";
import { socket } from "../socket";
import { showNotificationToast } from "../toasts/notificationToast.jsx";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useUser();
  const [hasNotifications, setHasNotifications] = useState(
    user?.hasNotifications
  );

  useEffect(() => {
    if (!socket.on) return;

    const handleNewNotification = (data) => {
      setHasNotifications(true);
      if (window.innerWidth >= 1024) {
        showNotificationToast(data);
      }
    };

    socket.on("newNotification", handleNewNotification);

    return () => socket.off("newNotification", handleNewNotification);
  }, [socket]);

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
