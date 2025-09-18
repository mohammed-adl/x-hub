// EX: 300 ,2k
export function formatTweetCounts(count) {
  if (!count) return "";
  if (count === 0) return "";

  if (count >= 1000) {
    return (count / 1000).toFixed(count >= 10000 ? 0 : 1) + "k";
  }
  return count.toString();
}
