// format to ISO string
export function formatBirthDate(year, month, day) {
  const isoDOB = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toISOString();
  return isoDOB;
}

//EX: 7y, 2h, 1m
export function formatTimeShort(prismaDateTime) {
  const date = new Date(prismaDateTime);
  const diffMs = Date.now() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return seconds + "s";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + "m";

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + "h";

  const days = Math.floor(hours / 24);
  if (days < 30) return days + "d";

  const months = Math.floor(days / 30);
  if (months < 12) return months + "mo";

  const years = Math.floor(months / 12);
  return years + "y";
}

//EX: June, 2022
export function formatJoinedDate(isoString) {
  const date = new Date(isoString);
  const options = { year: "numeric", month: "long" };
  return date.toLocaleDateString("en-US", options);
}

// EX: 2 hours ago
export function formatTimeAgo(dateInput) {
  const now = new Date();
  const date = new Date(dateInput);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}
