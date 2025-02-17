import { BalancingMethod, Protocol } from "./types";

const LOGGING_DIRECTORY = "./logs/";

const PROTOCOL: Protocol = "http";

const BALANCING_METHOD: BalancingMethod = "round-robin";

const ALLOWED_ORIGINS: Array<string> = [];

const SERVERS = [
  "http://localhost:5001",
  "http://localhost:5002",
  "http://localhost:5003",
];

export {
  LOGGING_DIRECTORY,
  PROTOCOL,
  BALANCING_METHOD,
  ALLOWED_ORIGINS,
  SERVERS,
};
