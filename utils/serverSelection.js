import { SERVERS } from "../config.js";

let currentServer = 0; // Server Index, ranges from 0 to 2

export function generateNextServerURL(path) {
  const serverURL = SERVERS[currentServer] + path;
  currentServer = (currentServer + 1) % SERVERS.length;

  return serverURL;
}
