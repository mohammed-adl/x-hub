import { formatTimeAgo } from "../../utils/index.js";
import { pc, mobile, tablet } from "../../assets/icons";
import styles from "./DevicesLogs.module.css";

function getDeviceIcon(deviceInfo = "") {
  const deviceName = deviceInfo.toLowerCase();

  if (
    deviceName.includes("iphone") ||
    deviceName.includes("android") ||
    deviceName.includes("mobile")
  ) {
    return mobile;
  }

  if (deviceName.includes("ipad") || deviceName.includes("tablet")) {
    return tablet;
  }
  return pc;
}

function getIpLabel(ip) {
  if (!ip) return "Unknown IP";
  if (ip === "::1") return "127.0.0.1";
  return ip;
}

function formatDeviceName(deviceInfo = "") {
  if (!deviceInfo) return "Unknown device";
  const parts = deviceInfo.split(" on ");
  return parts.join(" • ");
}

export default function DeviceCard({ session, isCurrent = false, onLogout }) {
  const { id, device, ip, createdAt } = session;

  return (
    <div className={`${styles.deviceCard} ${isCurrent ? styles.current : ""}`}>
      <div className={styles.deviceCardContent}>
        <img
          src={getDeviceIcon(device)}
          alt="Device icon"
          className={styles.deviceIcon}
        />
        <div className={styles.deviceInfo}>
          <p className={styles.deviceLocation}>{getIpLabel(ip)}</p>
          <p className={styles.deviceName}>{formatDeviceName(device)}</p>
          <div>
            <span className={styles.deviceCreatedAt}>
              {formatTimeAgo(createdAt)}
            </span>
          </div>
        </div>

        {isCurrent ? (
          <span className={styles.currentDeviceLabel}>Current Session</span>
        ) : (
          <button
            className={styles.logoutButton}
            onClick={() => onLogout?.(id)}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
