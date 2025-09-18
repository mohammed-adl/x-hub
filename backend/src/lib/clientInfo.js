import useragent from "useragent";

export function extractClientInfo(req) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  const agent = useragent.parse(req.headers["user-agent"]);
  const device = `${agent.family} ${agent.major} on ${agent.os.family} ${agent.os.major}`;

  return { ip, device };
}
