import { BALANCING_METHOD, SERVERS } from "../config";

const AVAILABLE_SERVERS = new Map<string, boolean>();
const CONNECTION_COUNTS = new Map<string, number>();

SERVERS.forEach((server) => {
  CONNECTION_COUNTS.set(server, 0);
});

let currentServer = 0;

const roundRobin = (url: string): string => {
  const targetURL = SERVERS[currentServer] + url;
  currentServer = (currentServer + 1) % SERVERS.length;

  return targetURL;
};

const leastConnections = (url: string): string => {
  let leastConnServer = SERVERS[0];
  let leastConnections = CONNECTION_COUNTS.get(leastConnServer) as number;

  SERVERS.forEach((server) => {
    const currentConnCount = CONNECTION_COUNTS.get(server) as number;
    if (currentConnCount < leastConnections) {
      leastConnServer = server;
      leastConnections = currentConnCount;
    }
  });

  CONNECTION_COUNTS.set(leastConnServer, leastConnections + 1);

  const targetURL = leastConnServer + url;
  return targetURL;
};

const generateTargetURL = (url: string): string => {
  if (BALANCING_METHOD === "round-robin") {
    return roundRobin(url);
  }

  return leastConnections(url);
};

export { AVAILABLE_SERVERS, generateTargetURL };
