import { BalancingMethod } from "./types";

const LOGGING_DIRECTORY = "./logs/";

const BALANCING_METHOD: BalancingMethod = "round-robin";

const ALLOWED_ORIGINS: Array<string> = [];

const SERVERS = [
  "http://localhost:5001",
  "http://localhost:5002",
  "http://localhost:5003",
];

export { LOGGING_DIRECTORY, BALANCING_METHOD, ALLOWED_ORIGINS, SERVERS };
