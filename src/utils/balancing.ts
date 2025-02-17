import { BALANCING_METHOD, SERVERS } from "../config";

const AVAILABLE_SERVERS = new Map<string, boolean>();
let currentServer = 0;

const roundRobin = (url: string): string => {
  const targetURL = SERVERS[currentServer] + url;
  currentServer = (currentServer + 1) % SERVERS.length;

  return targetURL;
};

const leastConnections = (url: string): string => {
  return "";
};

const generateTargetURL = (url: string): string => {
  if (BALANCING_METHOD === "round-robin") {
    return roundRobin(url);
  }

  return leastConnections(url);
};

export { AVAILABLE_SERVERS, generateTargetURL };
