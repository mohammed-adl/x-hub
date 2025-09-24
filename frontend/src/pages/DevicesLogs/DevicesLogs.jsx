import { useQuery, useQueryClient } from "@tanstack/react-query";
import DeviceCard from "./DeviceCard";

import { handleGetSessionsLogs } from "../../fetchers/user";
import {
  handleLogOutSession,
  handleLogOutAllSessions,
} from "../../fetchers/auth";

import { Spinner, ErrorMessage } from "../../components/ui";
import authService from "../../services/authService";
import styles from "./DevicesLogs.module.css";

export default function DevicesLogs() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      return await handleGetSessionsLogs(refreshToken);
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const devices = data?.sessions || [];
  const tokenId = localStorage.getItem("refreshTokenId");

  const currentSession = devices.find((session) => session.id === tokenId);
  const otherDevices = devices.filter((session) => session.id !== tokenId);

  async function logoutDevice(tokenId) {
    try {
      await handleLogOutSession(tokenId);
      queryClient.invalidateQueries(["sessions"]);
    } catch (err) {
      console.log(err);
    }
  }

  async function logoutAll() {
    try {
      await handleLogOutAllSessions();
      authService.logout();
    } catch (err) {
      console.log(err);
      if (err.status === 401) authService.logout();
    }
  }

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;

  return (
    <div className={styles.devicesPageContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.heading}>Devices Logs</h1>

        <div className={styles.deviceList}>
          {currentSession && <DeviceCard session={currentSession} isCurrent />}

          {otherDevices.map((session) => (
            <DeviceCard
              key={session.id}
              session={session}
              onLogout={logoutDevice}
            />
          ))}
        </div>

        <div className={styles.logoutAllContainer}>
          <button className={styles.logoutAllButton} onClick={logoutAll}>
            Logout All Devices
          </button>
        </div>
      </div>
    </div>
  );
}
